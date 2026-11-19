// src/guideline_corpus.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { classify_licence, may_quote_passage } from './tools.js';
import { build_ranking_questions } from './guideline_questions.js';
import {
    corpus_candidates,
    corpus_citation,
    parse_open_guideline_corpus,
} from './guideline_corpus.js';
import { rank_guideline_passages, select_restricted_citations } from './guideline_ranking.js';

const repoRoot = path.resolve(__dirname, '..');
const read_fixture = (name: string): unknown =>
    JSON.parse(readFileSync(path.join(repoRoot, 'src/__fixtures__/guidelines', name), 'utf8'));

const vadod = parse_open_guideline_corpus(read_fixture('vadod-2023-t2d.json'));

describe('VA/DoD 2023 type 2 diabetes corpus', () => {
    it('holds all 26 recommendations of Table 5, in order', () => {
        assert.deepEqual(
            vadod.recommendations.map((r) => r.id),
            Array.from({ length: 26 }, (_, i) => String(i + 1)),
        );
    });

    it('is quotable without a non-commercial exemption', () => {
        assert.equal(classify_licence(vadod.citation.licence), 'open');
        assert.equal(may_quote_passage(vadod.citation.licence), true);
    });

    it('records that the public-domain status is inferred, not stated', () => {
        assert.match(vadod.citation.licenceBasis, /^Inferred:/);
    });

    it('keeps each recommendation as a complete sentence with no extraction residue', () => {
        for (const rec of vadod.recommendations) {
            assert.match(rec.text, /^[A-Z].*\.$/, `recommendation ${rec.id} is truncated or mangled`);
            assert.doesNotMatch(rec.text, /\s{2,}|\\|\|/, `recommendation ${rec.id} carries layout residue`);
        }
    });

    it('states pharmacotherapy recommendations 19-26 under the Pharmacotherapy topic', () => {
        const pharmacotherapy = vadod.recommendations
            .filter((r) => r.topicAsStated === 'Pharmacotherapy')
            .map((r) => r.id);
        assert.deepEqual(pharmacotherapy, ['19', '20', '21', '22', '23', '24', '25', '26']);
    });

    it('cannot be routed through the restricted-licence path', () => {
        assert.throws(
            () => select_restricted_citations([], corpus_citation(vadod), null),
            /restricted-licence corpora/,
        );
    });
});

describe('parse_open_guideline_corpus', () => {
    const valid = read_fixture('vadod-2023-t2d.json') as {
        citation: Record<string, unknown>;
        recommendations: Array<Record<string, unknown>>;
    };
    const clone = () => structuredClone(valid);

    it('refuses a restricted corpus so its text never reaches the ranking questions', () => {
        const body = clone();
        body.citation.licence = 'All rights reserved';
        assert.throws(() => parse_open_guideline_corpus(body), /restricted licence/);
    });

    it('refuses a strength that is not on the issuer\'s own scale', () => {
        const body = clone();
        (body.recommendations[0] as Record<string, unknown>).strengthAsStated = 'Grade A';
        assert.throws(() => parse_open_guideline_corpus(body), /not on the issuer's scale/);
    });

    it('refuses duplicate recommendation ids', () => {
        const body = clone();
        (body.recommendations[1] as Record<string, unknown>).id = '1';
        assert.throws(() => parse_open_guideline_corpus(body), /Duplicate recommendation id 1/);
    });

    it('names the path of a missing field', () => {
        const body = clone();
        delete (body.recommendations[3] as Record<string, unknown>).text;
        assert.throws(
            () => parse_open_guideline_corpus(body),
            /"recommendations",\s*3,\s*"text"/,
        );
    });

    it('rejects the restricted ADA fixture, which has no passages to load', () => {
        assert.throws(() => parse_open_guideline_corpus(read_fixture('ada-2026-t2d.json')));
    });
});

describe('from corpus to ranked answer', () => {
    const candidates = corpus_candidates(vadod, 'vadod2023');

    it('passes each recommendation through unchanged as a candidate passage', () => {
        assert.equal(candidates.length, 26);
        candidates.forEach((c, i) => {
            assert.equal(c.passage, vadod.recommendations[i]?.text);
            assert.equal(c.id, `vadod2023-${i + 1}`);
        });
    });

    it('requires an id prefix', () => {
        assert.throws(() => corpus_candidates(vadod, ''), /id prefix/);
    });

    it('builds one ranking request over the whole corpus', () => {
        const questions = build_ranking_questions({
            query: {
                question: 'Which glucose-lowering drug should an adult with type 2 diabetes and heart failure take?',
                condition: 'type 2 diabetes',
                comorbidity: 'heart failure',
            },
            candidates,
        });
        assert.equal(questions.length, 1 + 3 * 26);
    });

    // The judgments below are hand-set, not Jev's: this checks that a real recommendation
    // comes out of the decision layer verbatim and with its own strength, not that Jev
    // would pick it. That needs the live API (step 4).
    it('quotes the source wording and stated strength when a recommendation is chosen', () => {
        const rec21 = vadod.recommendations.find((r) => r.id === '21');
        assert.ok(rec21);
        const result = rank_guideline_passages(
            [
                {
                    id: 'vadod2023-21',
                    passage: rec21.text,
                    citation: corpus_citation(vadod),
                    recommendationStrength: rec21.strengthAsStated,
                    judgments: { statesDrugChoice: 0.95, populationMatches: 0.95, relevance: 3 },
                },
            ],
            { anyCandidateStatesDrugChoice: 0.95 },
        );
        const [decision] = result.decisions;
        assert.equal(decision?.kind, 'quote');
        assert.ok(decision?.kind === 'quote');
        assert.equal(
            decision.passage,
            'For adults with type 2 diabetes mellitus and heart failure, we recommend a sodium-glucose cotransporter-2 inhibitor to prevent hospital admissions for heart failure.',
        );
        assert.equal(decision.recommendationStrength, 'Strong for');
        assert.equal(result.sufficientEvidence, true);
    });
});
