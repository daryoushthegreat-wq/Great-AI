// src/guideline_routing.ts
//
// Deterministic routing from a patient situation to guideline recommendations, for use
// without a live model call. Open recommendations match on exact phrases in the issuer's
// own text, so the page can highlight why each one was selected; restricted ones match on
// the corpus's comorbidity tags. No wording is generated and nothing is inferred.

import type { OpenGuidelineCorpus, OpenGuidelineRecommendation } from './guideline_corpus.js';

export interface Situation {
    id: string;
    /** What a clinician would call it. Shown on the page. */
    label: string;
    /** Lower-case phrases matched against open recommendation text. */
    phrases: readonly string[];
    /** Comorbidity tags in restricted corpora that this situation selects. */
    restrictedTags: readonly string[];
}

export const SITUATIONS: readonly Situation[] = [
    {
        id: 'ascvd',
        label: 'Established cardiovascular disease',
        phrases: ['with atherosclerotic cardiovascular disease', 'have cardiovascular disease'],
        restrictedTags: ['ascvd'],
    },
    {
        id: 'cv-risk',
        label: 'High cardiovascular risk',
        phrases: ['at high risk of atherosclerotic cardiovascular disease'],
        restrictedTags: [],
    },
    {
        id: 'heart-failure',
        label: 'Heart failure',
        phrases: ['heart failure'],
        restrictedTags: ['heart_failure'],
    },
    {
        id: 'ckd',
        label: 'Chronic kidney disease',
        phrases: ['chronic kidney disease', 'renal disease'],
        restrictedTags: ['ckd', 'ckd_advanced'],
    },
    {
        id: 'obesity',
        label: 'Obesity',
        phrases: ['obesity'],
        restrictedTags: ['obesity'],
    },
    {
        id: 'liver',
        label: 'Fatty liver disease (MASLD / MASH)',
        phrases: ['fatty liver disease', 'steatohepatitis'],
        restrictedTags: ['masld', 'mash'],
    },
    {
        id: 'older',
        label: 'Age 65 or older',
        phrases: ['65 years and older'],
        restrictedTags: [],
    },
    {
        id: 'cognition-falls',
        label: 'Cognitive impairment or fall risk',
        phrases: ['cognitive impairment', 'risk of falls', 'fall risk'],
        restrictedTags: [],
    },
];

export interface OpenMatch {
    recommendation: OpenGuidelineRecommendation;
    /** Phrases from the situation found in the text, in the order the situation lists them. */
    matchedPhrases: string[];
}

export function find_situation(id: string): Situation {
    const situation = SITUATIONS.find((s) => s.id === id);
    if (!situation) {
        throw new Error(`Unknown situation '${id}'. Known: ${SITUATIONS.map((s) => s.id).join(', ')}.`);
    }
    return situation;
}

/** Recommendations whose own text names the situation. Order follows the corpus. */
export function match_open_recommendations(
    corpus: OpenGuidelineCorpus,
    situation: Situation,
): OpenMatch[] {
    const matches: OpenMatch[] = [];
    for (const recommendation of corpus.recommendations) {
        const text = recommendation.text.toLowerCase();
        const matchedPhrases = situation.phrases.filter((p) => text.includes(p));
        if (matchedPhrases.length) matches.push({ recommendation, matchedPhrases });
    }
    return matches;
}
