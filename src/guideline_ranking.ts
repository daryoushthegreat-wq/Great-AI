// src/guideline_ranking.ts
//
// The decision layer. Jev supplies the judgments; everything here is ordinary code, so
// what the page shows is visible and testable without calling the API.
//
// Nothing in this module infers clinical content. It decides which retrieved passage to
// show and whether its text may be quoted. The recommendation itself is always the
// source's own words, and its strength is always the grade the source states.

import { classify_licence, may_quote_passage, type Guideline } from './tools.js';
import { MIN_RELEVANCE, NOUL_NO, NOUL_YES, type RelevanceLevel } from './guideline_questions.js';

/** The three judgments Jev returns for one candidate passage. */
export interface PassageJudgments {
    /** Noul: does the passage state which medication or class to use? */
    statesDrugChoice: number;
    /** Noul: does its population include the comorbidity in the question? */
    populationMatches: number;
    /** Score: how directly it answers the question, as a level index. */
    relevance: RelevanceLevel;
}

export interface RankingCandidate {
    id: string;
    /** The source's own wording. Withheld from the output unless the licence permits it. */
    passage: string;
    citation: Guideline;
    /** Strength exactly as the source states it, e.g. 'A'. Never inferred. */
    recommendationStrength?: string;
    judgments: PassageJudgments;
}

export type RejectionReason =
    | 'not_a_drug_recommendation'
    | 'population_mismatch'
    | 'insufficient_relevance';

export type UnsettledReason = 'drug_recommendation_unsettled' | 'population_unsettled';

/**
 * What the page does with one candidate.
 *
 * `citation_only` is not a failure: it is the correct outcome for guidance that is free to
 * read but not licensed for redistribution. The reader still gets the issuer, the
 * recommendation id and a link.
 */
export type PassageDecision =
    | {
          id: string;
          kind: 'quote';
          passage: string;
          citation: Guideline;
          relevance: RelevanceLevel;
          recommendationStrength?: string;
          /** True when the passage states drug choice but not for this comorbidity. */
          populationCaveat: boolean;
      }
    | {
          id: string;
          kind: 'citation_only';
          citation: Guideline;
          relevance: RelevanceLevel;
          recommendationStrength?: string;
          reason: 'licence_withholds_text';
      }
    | { id: string; kind: 'unsettled'; citation: Guideline; reason: UnsettledReason }
    | { id: string; kind: 'rejected'; reason: RejectionReason };

export interface RankedGuidelineEvidence {
    decisions: PassageDecision[];
    /**
     * Whether anything is worth showing. False is a first-class answer: the open sources
     * searched do not settle the question, which is safer than the closest loose match.
     */
    sufficientEvidence: boolean;
}

export interface RankingOptions {
    /** Probability from the companion Noul that any candidate states drug choice. */
    anyCandidateStatesDrugChoice: number;
    /** Set true only when the deployment itself is non-commercial. */
    allowNonCommercial?: boolean;
    /** True when the question named no comorbidity, so the population gate is advisory. */
    questionHasNoComorbidity?: boolean;
}

/**
 * Decide what to do with each candidate, then whether the set answers the question.
 *
 * The gates are evaluated in a fixed order so that a candidate failing several of them
 * always reports the same reason. Every combination of answers lands on a decision,
 * including the band between NOUL_NO and NOUL_YES where the judgment is unsettled — that
 * band gets its own outcome rather than being rounded into a yes or a no.
 */
export function rank_guideline_passages(
    candidates: readonly RankingCandidate[],
    options: RankingOptions,
): RankedGuidelineEvidence {
    if (!Number.isFinite(options.anyCandidateStatesDrugChoice)) {
        throw new Error('anyCandidateStatesDrugChoice must be a finite probability.');
    }

    const decisions = candidates.map((candidate) => decide(candidate, options));

    // A set-level no from the companion Noul overrides individual passage decisions: if
    // nothing in the set addresses drug choice, a confident-looking single passage is more
    // likely a near-miss than an answer.
    const anyFits = options.anyCandidateStatesDrugChoice > NOUL_NO;
    const hasShowable = decisions.some((d) => d.kind === 'quote' || d.kind === 'citation_only');

    return {
        decisions: sort_decisions(decisions),
        sufficientEvidence: anyFits && hasShowable,
    };
}

function decide(candidate: RankingCandidate, options: RankingOptions): PassageDecision {
    const { statesDrugChoice, populationMatches, relevance } = candidate.judgments;

    if (statesDrugChoice <= NOUL_NO) {
        return { id: candidate.id, kind: 'rejected', reason: 'not_a_drug_recommendation' };
    }
    if (statesDrugChoice < NOUL_YES) {
        return {
            id: candidate.id,
            kind: 'unsettled',
            citation: candidate.citation,
            reason: 'drug_recommendation_unsettled',
        };
    }

    // With no comorbidity in the question there is no population to mismatch, so the
    // population answer only decides whether a caveat is shown.
    const populationGated = options.questionHasNoComorbidity !== true;
    if (populationGated) {
        if (populationMatches <= NOUL_NO && relevance < MIN_RELEVANCE) {
            return { id: candidate.id, kind: 'rejected', reason: 'population_mismatch' };
        }
        if (populationMatches < NOUL_YES && populationMatches > NOUL_NO) {
            return {
                id: candidate.id,
                kind: 'unsettled',
                citation: candidate.citation,
                reason: 'population_unsettled',
            };
        }
    }

    if (relevance < MIN_RELEVANCE) {
        return { id: candidate.id, kind: 'rejected', reason: 'insufficient_relevance' };
    }

    const quotable = may_quote_passage(candidate.citation.source.licence, {
        allowNonCommercial: options.allowNonCommercial === true,
    });

    if (!quotable) {
        return {
            id: candidate.id,
            kind: 'citation_only',
            citation: candidate.citation,
            relevance,
            ...(candidate.recommendationStrength === undefined
                ? {}
                : { recommendationStrength: candidate.recommendationStrength }),
            reason: 'licence_withholds_text',
        };
    }

    return {
        id: candidate.id,
        kind: 'quote',
        passage: candidate.passage,
        citation: candidate.citation,
        relevance,
        ...(candidate.recommendationStrength === undefined
            ? {}
            : { recommendationStrength: candidate.recommendationStrength }),
        populationCaveat: populationGated && populationMatches < NOUL_YES,
    };
}

const KIND_ORDER: Record<PassageDecision['kind'], number> = {
    quote: 0,
    citation_only: 1,
    unsettled: 2,
    rejected: 3,
};

function sort_decisions(decisions: readonly PassageDecision[]): PassageDecision[] {
    return [...decisions].sort((a, b) => {
        const byKind = KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
        if (byKind !== 0) return byKind;
        const relevanceOf = (d: PassageDecision) =>
            d.kind === 'quote' || d.kind === 'citation_only' ? d.relevance : -1;
        return relevanceOf(b) - relevanceOf(a);
    });
}

/** One recommendation in a restricted-licence corpus: metadata, never passage text. */
export interface RestrictedRecommendation {
    id: string;
    evidenceGradeAsStated: string;
    comorbidities: readonly string[];
    topic: string;
}

export interface RestrictedCitation {
    recommendationId: string;
    evidenceGradeAsStated: string;
    topic: string;
    citation: Guideline;
}

/**
 * Select recommendations from a corpus whose licence forbids machine processing.
 *
 * Deterministic metadata matching, with no model involved: the licence that stops us
 * quoting this guidance also stops us sending it for text and data mining, so there is
 * nothing for Jev to judge. Matching on the corpus's own comorbidity tags is the honest
 * alternative, and it is exact rather than approximate.
 *
 * A match is returned as a citation and a recommendation id. Callers must not render the
 * `topic` string as though it were the guideline's wording — it is our label for routing.
 */
export function select_restricted_citations(
    recommendations: readonly RestrictedRecommendation[],
    citation: Guideline,
    comorbidity: string | null,
): RestrictedCitation[] {
    if (classify_licence(citation.source.licence) !== 'restricted') {
        throw new Error(
            'select_restricted_citations is for restricted-licence corpora; use the ranking path for licensed passages.',
        );
    }

    const matches = recommendations.filter((rec) =>
        comorbidity === null ? rec.comorbidities.length === 0 : rec.comorbidities.includes(comorbidity),
    );

    return matches.map((rec) => ({
        recommendationId: rec.id,
        evidenceGradeAsStated: rec.evidenceGradeAsStated,
        topic: rec.topic,
        citation,
    }));
}
