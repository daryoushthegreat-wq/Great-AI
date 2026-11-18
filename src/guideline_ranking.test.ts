// src/guideline_ranking.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { classify_licence, type Guideline } from './tools.js';
import {
    ANY_CANDIDATE_QUESTION_ID,
    build_ranking_questions,
    MIN_RELEVANCE,
    question_id,
    RELEVANCE_LEVELS,
    type RankingState,
} from './guideline_questions.js';
import {
    rank_guideline_passages,
    select_restricted_citations,
    type PassageDecision,
    type RankingCandidate,
} from './guideline_ranking.js';

const OPEN_LICENCE = 'CC BY 4.0';
const NONCOMMERCIAL_LICENCE = 'CC BY-NC-SA 3.0 IGO';
const RESTRICTED_LICENCE = 'All rights reserved - permission required';

function citation(licence: string, organization = 'Example Society'): Guideline {
    return {
        title: 'Pharmacologic management of type 2 diabetes',
        organization,
        year: 2026,
        source: {
            name: organization,
            url: 'https://example.org/guideline',
            licence,
            retrievedAt: '2026-11-18T00:00:00Z',
        },
    };
}

function candidate(overrides: Partial<RankingCandidate> = {}): RankingCandidate {
    return {
        id: 'c1',
        passage: 'In adults with condition X and comorbidity Y, class Z is recommended.',
        citation: citation(OPEN_LICENCE),
        recommendationStrength: 'A',
        judgments: { statesDrugChoice: 0.95, populationMatches: 0.92, relevance: 3 },
        ...overrides,
    };
}

/** Companion Noul answered yes, so set-level gating is out of the way. */
const SET_FITS = { anyCandidateStatesDrugChoice: 0.9 };

function only(decisions: readonly PassageDecision[]): PassageDecision {
    assert.equal(decisions.length, 1, 'expected exactly one decision');
    return decisions[0] as PassageDecision;
}

describe('rank_guideline_passages: licence gate', () => {
    it('quotes the passage when the licence is open', () => {
        const result = rank_guideline_passages([candidate()], SET_FITS);
        const decision = only(result.decisions);
        assert.equal(decision.kind, 'quote');
        assert.ok(decision.kind === 'quote' && decision.passage.includes('class Z'));
        assert.equal(result.sufficientEvidence, true);
    });

    it('withholds text but keeps the citation when the licence is restricted', () => {
        const result = rank_guideline_passages(
            [candidate({ citation: citation(RESTRICTED_LICENCE, 'American Diabetes Association') })],
            SET_FITS,
        );
        const decision = only(result.decisions);
        assert.equal(decision.kind, 'citation_only');
        assert.ok(decision.kind === 'citation_only' && decision.reason === 'licence_withholds_text');
        // The point of the gate: no passage text anywhere in the returned object.
        assert.ok(!JSON.stringify(decision).includes('class Z'));
        // Still a usable answer for the reader: issuer, grade and link survive.
        assert.equal(decision.kind === 'citation_only' && decision.recommendationStrength, 'A');
        assert.equal(result.sufficientEvidence, true);
    });

    it('treats a non-commercial licence as quotable only when the deployment is non-commercial', () => {
        const nc = [candidate({ citation: citation(NONCOMMERCIAL_LICENCE, 'WHO') })];

        assert.equal(only(rank_guideline_passages(nc, SET_FITS).decisions).kind, 'citation_only');
        assert.equal(
            only(rank_guideline_passages(nc, { ...SET_FITS, allowNonCommercial: true }).decisions).kind,
            'quote',
        );
    });
});

describe('rank_guideline_passages: truth table', () => {
    it('rejects a passage that does not state a drug choice', () => {
        const result = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.08, populationMatches: 0.9, relevance: 3 } })],
            SET_FITS,
        );
        const decision = only(result.decisions);
        assert.equal(decision.kind, 'rejected');
        assert.ok(decision.kind === 'rejected' && decision.reason === 'not_a_drug_recommendation');
        assert.equal(result.sufficientEvidence, false);
    });

    it('reports the middle band as unsettled rather than rounding it to yes or no', () => {
        const drug = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.5, populationMatches: 0.9, relevance: 3 } })],
            SET_FITS,
        );
        const d1 = only(drug.decisions);
        assert.ok(d1.kind === 'unsettled' && d1.reason === 'drug_recommendation_unsettled');

        const population = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.9, populationMatches: 0.5, relevance: 3 } })],
            SET_FITS,
        );
        const d2 = only(population.decisions);
        assert.ok(d2.kind === 'unsettled' && d2.reason === 'population_unsettled');

        // An unsettled passage is not an answer, so the set does not count as settled.
        assert.equal(drug.sufficientEvidence, false);
        assert.equal(population.sufficientEvidence, false);
    });

    it('rejects a clear population mismatch that is also off-topic', () => {
        const result = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.9, populationMatches: 0.05, relevance: 1 } })],
            SET_FITS,
        );
        const decision = only(result.decisions);
        assert.ok(decision.kind === 'rejected' && decision.reason === 'population_mismatch');
    });

    it('keeps a condition-level recommendation but marks the population caveat', () => {
        // Level 2 is "states drug choice for the condition, not for this comorbidity".
        const result = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.9, populationMatches: 0.05, relevance: 2 } })],
            SET_FITS,
        );
        const decision = only(result.decisions);
        assert.equal(decision.kind, 'quote');
        assert.equal(decision.kind === 'quote' && decision.populationCaveat, true);
    });

    it('rejects a passage below the relevance floor', () => {
        const result = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.9, populationMatches: 0.9, relevance: 1 } })],
            SET_FITS,
        );
        const decision = only(result.decisions);
        assert.ok(decision.kind === 'rejected' && decision.reason === 'insufficient_relevance');
    });

    it('skips the population gate when the question names no comorbidity', () => {
        const result = rank_guideline_passages(
            [candidate({ judgments: { statesDrugChoice: 0.9, populationMatches: 0.1, relevance: 3 } })],
            { ...SET_FITS, questionHasNoComorbidity: true },
        );
        const decision = only(result.decisions);
        assert.equal(decision.kind, 'quote');
        assert.equal(decision.kind === 'quote' && decision.populationCaveat, false);
    });
});

describe('rank_guideline_passages: set-level outcome', () => {
    it('reports no sufficient evidence when the companion Noul says nothing fits', () => {
        const result = rank_guideline_passages([candidate()], {
            anyCandidateStatesDrugChoice: 0.04,
        });
        // The individual passage still looks good; the set-level answer overrides it.
        assert.equal(only(result.decisions).kind, 'quote');
        assert.equal(result.sufficientEvidence, false);
    });

    it('reports no sufficient evidence when every candidate is rejected', () => {
        const result = rank_guideline_passages(
            [
                candidate({ id: 'a', judgments: { statesDrugChoice: 0.02, populationMatches: 0.9, relevance: 3 } }),
                candidate({ id: 'b', judgments: { statesDrugChoice: 0.9, populationMatches: 0.9, relevance: 0 } }),
            ],
            SET_FITS,
        );
        assert.equal(result.sufficientEvidence, false);
        assert.ok(result.decisions.every((d) => d.kind === 'rejected'));
    });

    it('orders quotes first, then citation-only, then unsettled, then rejected', () => {
        const result = rank_guideline_passages(
            [
                candidate({ id: 'rejected', judgments: { statesDrugChoice: 0.01, populationMatches: 0.9, relevance: 3 } }),
                candidate({ id: 'unsettled', judgments: { statesDrugChoice: 0.5, populationMatches: 0.9, relevance: 3 } }),
                candidate({ id: 'citation', citation: citation(RESTRICTED_LICENCE) }),
                candidate({ id: 'quote_low', judgments: { statesDrugChoice: 0.9, populationMatches: 0.9, relevance: 2 } }),
                candidate({ id: 'quote_high' }),
            ],
            SET_FITS,
        );
        assert.deepEqual(
            result.decisions.map((d) => d.id),
            ['quote_high', 'quote_low', 'citation', 'unsettled', 'rejected'],
        );
    });

    it('rejects a non-finite set-level probability instead of guessing', () => {
        assert.throws(
            () => rank_guideline_passages([candidate()], { anyCandidateStatesDrugChoice: NaN }),
            /finite probability/,
        );
    });
});

describe('build_ranking_questions', () => {
    const state: RankingState = {
        query: {
            question: 'Which glucose-lowering drug is recommended in type 2 diabetes with heart failure?',
            condition: 'type 2 diabetes',
            comorbidity: 'heart failure',
        },
        candidates: [
            { id: 'p1', issuer: 'WHO', year: 2020, passage: 'Passage one.' },
            { id: 'p2', issuer: 'NICE', year: 2022, passage: 'Passage two.' },
        ],
    };

    it('asks three questions per candidate plus one companion Noul', () => {
        const questions = build_ranking_questions(state);
        assert.equal(questions.length, 1 + 3 * 2);
        assert.equal(questions[0]?.id, ANY_CANDIDATE_QUESTION_ID);
        for (const id of ['p1', 'p2']) {
            for (const kind of ['states_drug_choice', 'population_matches', 'answers_question'] as const) {
                assert.ok(
                    questions.some((q) => q.id === question_id(kind, id)),
                    `missing ${kind} for ${id}`,
                );
            }
        }
    });

    it('names the comorbidity in the population question rather than a placeholder', () => {
        const questions = build_ranking_questions(state);
        const population = questions.find((q) => q.id === question_id('population_matches', 'p1'));
        assert.ok(population?.instructions.includes('heart failure'));
    });

    it('asks a general-population question when the query names no comorbidity', () => {
        const questions = build_ranking_questions({
            ...state,
            query: { ...state.query, comorbidity: null },
        });
        const population = questions.find((q) => q.id === question_id('population_matches', 'p1'));
        assert.ok(population?.instructions.includes('generally'));
    });

    it('gives the relevance Score one level per described situation', () => {
        const questions = build_ranking_questions(state);
        const score = questions.find((q) => q.id === question_id('answers_question', 'p1'));
        assert.equal(score?.type, 'score');
        assert.equal(score?.type === 'score' && score.criteria.length, RELEVANCE_LEVELS.length);
        assert.ok(MIN_RELEVANCE < RELEVANCE_LEVELS.length);
    });

    it('rejects a request with no candidates', () => {
        assert.throws(
            () => build_ranking_questions({ ...state, candidates: [] }),
            /At least one candidate/,
        );
    });
});

describe('restricted-licence corpus (ADA Standards of Care 2026, section 9)', () => {
    const repoRoot = path.resolve(__dirname, '..');
    const corpus = JSON.parse(
        readFileSync(path.join(repoRoot, 'src/__fixtures__/guidelines/ada-2026-t2d.json'), 'utf8'),
    ) as {
        citation: { title: string; organization: string; year: number; url: string; licence: string };
        recommendations: Array<{
            id: string;
            evidenceGradeAsStated: string;
            comorbidities: string[];
            topic: string;
        }>;
    };

    const adaCitation: Guideline = {
        title: corpus.citation.title,
        organization: corpus.citation.organization,
        year: corpus.citation.year,
        url: corpus.citation.url,
        source: {
            name: corpus.citation.organization,
            url: corpus.citation.url,
            licence: corpus.citation.licence,
            retrievedAt: '2026-11-18T00:00:00Z',
        },
    };

    it('stores no passage text, because the licence forbids mirroring and machine processing', () => {
        const raw = readFileSync(
            path.join(repoRoot, 'src/__fixtures__/guidelines/ada-2026-t2d.json'),
            'utf8',
        );
        // The corpus records identifiers and our own topic labels. If a future edit pastes
        // the guideline's own recommendation wording in, these markers are what catch it.
        for (const giveaway of ['is recommended', 'should include', 'irrespective of A1C']) {
            assert.ok(!raw.includes(giveaway), `fixture contains guideline wording: ${giveaway}`);
        }
        for (const rec of corpus.recommendations) {
            assert.ok(!('passage' in rec), `recommendation ${rec.id} carries passage text`);
        }
    });

    it('classifies the ADA licence as restricted, so the quote path is unreachable', () => {
        assert.equal(classify_licence(corpus.citation.licence), 'restricted');
    });

    it('selects recommendations for a comorbidity by metadata, with no model involved', () => {
        const ckd = select_restricted_citations(corpus.recommendations, adaCitation, 'ckd');
        assert.deepEqual(
            ckd.map((c) => c.recommendationId),
            ['9.10'],
        );
        assert.equal(ckd[0]?.evidenceGradeAsStated, 'A');

        const hf = select_restricted_citations(corpus.recommendations, adaCitation, 'heart_failure');
        assert.deepEqual(
            hf.map((c) => c.recommendationId),
            ['9.8', '9.9a'],
        );
    });

    it('returns the untargeted recommendations when no comorbidity is given', () => {
        const general = select_restricted_citations(corpus.recommendations, adaCitation, null);
        assert.deepEqual(
            general.map((c) => c.recommendationId),
            ['9.5', '9.18', '9.21'],
        );
    });

    it('returns nothing for a comorbidity the corpus does not cover', () => {
        assert.deepEqual(select_restricted_citations(corpus.recommendations, adaCitation, 'gout'), []);
    });

    it('refuses to run the metadata path on a licence that permits quoting', () => {
        assert.throws(
            () => select_restricted_citations(corpus.recommendations, citation(OPEN_LICENCE), 'ckd'),
            /restricted-licence corpora/,
        );
    });
});
