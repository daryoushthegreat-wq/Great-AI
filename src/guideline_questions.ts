// src/guideline_questions.ts
//
// Every question, criterion and threshold used to rank guideline passages lives here.
// These are the parts a clinician or reviewer audits and edits, so they are kept in one
// module rather than inlined at the call sites.
//
// Scope: these questions are only ever asked about passages whose licence permits
// machine processing. Society guidance whose terms forbid text and data mining is matched
// deterministically on its own metadata instead — see `select_restricted_citations` in
// guideline_ranking.ts. That split is a licensing constraint, not a quality judgment.

/** Noul probability at or above which code reads the answer as yes. */
export const NOUL_YES = 0.7;

/** Noul probability at or below which code reads the answer as no. */
export const NOUL_NO = 0.3;

/**
 * Lowest `answers_question` level that may be shown as an answer.
 *
 * Level 2 states drug choice for the condition but not for the comorbidity asked about,
 * which is still worth surfacing with its population caveat. Level 1 and below are a
 * different clinical decision and are dropped.
 */
export const MIN_RELEVANCE = 2;

/** Ordered levels for the relevance Score. Index is the level value. */
export const RELEVANCE_LEVELS = [
    'The passage is about a different condition, or about a clinical decision other than medication.',
    'The passage concerns the same condition but a decision other than which medication to use, such as screening, monitoring or targets.',
    'The passage states which medication or class to use for the condition, but does not address the comorbidity the question asks about.',
    'The passage states which medication or class to use for the condition in the specific population the question asks about.',
] as const;

export type RelevanceLevel = 0 | 1 | 2 | 3;

/**
 * The state sent with a ranking request.
 *
 * Named fields rather than a serialized blob, so each question can refer to the part it
 * judges by its exact path. `candidates` carries only passages that cleared the licence
 * check; a restricted passage never reaches this object.
 */
export interface RankingState {
    query: {
        /** The clinician's question, in their own words. */
        question: string;
        /** Condition the question is about, e.g. 'type 2 diabetes'. */
        condition: string;
        /** Comorbidity that narrows the population, or null when the question has none. */
        comorbidity: string | null;
    };
    candidates: Array<{
        id: string;
        issuer: string;
        year: number | undefined;
        passage: string;
    }>;
}

/** A question in the shape the TypeSafe API accepts, without depending on the SDK types. */
export type RankingQuestion =
    | {
          id: string;
          type: 'noul';
          instructions: string;
          criteria: { true: string; false: string };
      }
    | {
          id: string;
          type: 'score';
          instructions: string;
          criteria: readonly string[];
      };

/** Question id for the companion Noul that asks whether anything in the set fits. */
export const ANY_CANDIDATE_QUESTION_ID = 'any_candidate_states_drug_choice';

export const PER_PASSAGE_QUESTION_KINDS = [
    'states_drug_choice',
    'population_matches',
    'answers_question',
] as const;

export type PerPassageQuestionKind = (typeof PER_PASSAGE_QUESTION_KINDS)[number];

/** `kind__id`, so a flat answer map can be split back into per-candidate judgments. */
export function question_id(kind: PerPassageQuestionKind, candidateId: string): string {
    return `${kind}__${candidateId}`;
}

/**
 * Build every question for one ranking request.
 *
 * All candidates go in a single request: they share the state, so it is read and paid for
 * once, and the questions run in parallel. The companion Noul is asked over the whole set
 * so that code can distinguish "no passage fits" from "here is the least bad passage" —
 * a Score always returns a level, so without it an empty answer is unrepresentable.
 */
export function build_ranking_questions(state: RankingState): RankingQuestion[] {
    if (!state.candidates.length) {
        throw new Error('At least one candidate passage is required to build ranking questions.');
    }

    const population = state.query.comorbidity;
    const questions: RankingQuestion[] = [
        {
            id: ANY_CANDIDATE_QUESTION_ID,
            type: 'noul',
            instructions: `Do any of the passages in \`candidates\` state which medication or medication class to use for ${state.query.condition}?`,
            criteria: {
                true: `At least one passage names a medication or class and says to use, prefer, start, add or avoid it in ${state.query.condition}.`,
                false: `Every passage covers something else, such as how often to monitor, what the treatment targets are, or how common the condition is.`,
            },
        },
    ];

    for (const candidate of state.candidates) {
        const path = `the passage in \`candidates\` with id ${candidate.id}`;

        questions.push({
            id: question_id('states_drug_choice', candidate.id),
            type: 'noul',
            instructions: `Does ${path} state which medication or medication class to use?`,
            criteria: {
                true: 'The passage names a medication, a medication class or a combination, and says to use, prefer, start, add or avoid it.',
                false: 'The passage describes how common the condition is, how the disease works, how a trial was run, or how to monitor someone, without naming a medication to use.',
            },
        });

        // Asked for every candidate even when the question names no comorbidity, so the
        // answer map has one shape. Code ignores it in that case rather than the question
        // changing between requests.
        questions.push({
            id: question_id('population_matches', candidate.id),
            type: 'noul',
            instructions: population
                ? `Does the population described in ${path} include adults who have ${population}?`
                : `Does ${path} apply to adults with ${state.query.condition} generally, rather than to one narrow subgroup?`,
            criteria: population
                ? {
                      true: `The passage's population includes adults with ${population}.`,
                      false: `The passage is about a different group, such as children, people who are pregnant, or a different type of the condition.`,
                  }
                : {
                      true: `The passage applies to adults with ${state.query.condition} in general.`,
                      false: `The passage applies only to a narrow subgroup, such as people on dialysis or people receiving cancer treatment.`,
                  },
        });

        questions.push({
            id: question_id('answers_question', candidate.id),
            type: 'score',
            instructions: `How directly does ${path} answer this question: ${state.query.question}`,
            criteria: RELEVANCE_LEVELS,
        });
    }

    return questions;
}
