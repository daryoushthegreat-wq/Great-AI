// src/guideline_corpus.ts
//
// Loads an openly licensed guideline corpus and turns it into ranking candidates.
//
// Only corpora whose licence permits quoting come through here: their recommendation text
// is the passage Jev judges and the page shows verbatim. Restricted corpora carry metadata
// only and go through `select_restricted_citations` instead.

import { z } from 'zod';

import { classify_licence, type Guideline } from './tools.js';
import type { RankingState } from './guideline_questions.js';

const OpenGuidelineCorpusSchema = z
    .object({
        citation: z.object({
            title: z.string().min(1),
            organization: z.string().min(1),
            year: z.number().int(),
            version: z.string().optional(),
            publishedOn: z.string().optional(),
            url: z.url(),
            landingPage: z.url().optional(),
            licence: z.string().min(1),
            /** Why the licence is what it says, including anything inferred rather than stated. */
            licenceBasis: z.string().min(1),
            retrievedAt: z.iso.datetime(),
        }),
        condition: z.string().min(1),
        /** The issuer's own strength scale, so every stated strength can be checked against it. */
        strengthScale: z.array(z.string().min(1)).min(1),
        recommendations: z
            .array(
                z.object({
                    id: z.string().min(1),
                    topicAsStated: z.string().min(1),
                    subTopicAsStated: z.string().nullable(),
                    /** The issuer's own wording, verbatim. */
                    text: z.string().min(1),
                    strengthAsStated: z.string().min(1),
                    categoryAsStated: z.string().optional(),
                }),
            )
            .min(1),
    })
    .superRefine((corpus, ctx) => {
        const ids = new Set<string>();
        corpus.recommendations.forEach((rec, i) => {
            if (ids.has(rec.id)) {
                ctx.addIssue({ code: 'custom', path: ['recommendations', i, 'id'], message: `Duplicate recommendation id ${rec.id}.` });
            }
            ids.add(rec.id);
            if (!corpus.strengthScale.includes(rec.strengthAsStated)) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['recommendations', i, 'strengthAsStated'],
                    message: `Strength "${rec.strengthAsStated}" is not on the issuer's scale.`,
                });
            }
        });
    });

export type OpenGuidelineCorpus = z.infer<typeof OpenGuidelineCorpusSchema>;
export type OpenGuidelineRecommendation = OpenGuidelineCorpus['recommendations'][number];

/**
 * Validate a corpus at the boundary. Throws with a path if a field is missing or malformed,
 * and refuses a corpus whose licence does not permit machine processing, so a restricted
 * source cannot reach the ranking questions by being loaded through the wrong function.
 */
export function parse_open_guideline_corpus(body: unknown): OpenGuidelineCorpus {
    const corpus = OpenGuidelineCorpusSchema.parse(body);
    if (classify_licence(corpus.citation.licence) === 'restricted') {
        throw new Error(
            `Corpus "${corpus.citation.title}" has a restricted licence; load it as citation metadata, not as passages.`,
        );
    }
    return corpus;
}

/** The corpus's citation in the shape the rest of the toolkit uses. */
export function corpus_citation(corpus: OpenGuidelineCorpus): Guideline {
    return {
        title: corpus.citation.title,
        organization: corpus.citation.organization,
        year: corpus.citation.year,
        url: corpus.citation.url,
        source: {
            name: corpus.citation.organization,
            url: corpus.citation.url,
            licence: corpus.citation.licence,
            retrievedAt: corpus.citation.retrievedAt,
        },
    };
}

/**
 * Ranking candidates for `build_ranking_questions`, one per recommendation.
 *
 * Candidate ids are `<corpus prefix>-<recommendation id>` so ids from several corpora can
 * share one request without colliding. The passage is the recommendation text unchanged.
 */
export function corpus_candidates(
    corpus: OpenGuidelineCorpus,
    idPrefix: string,
): RankingState['candidates'] {
    if (!idPrefix) throw new Error('An id prefix is required so candidate ids stay unique across corpora.');
    return corpus.recommendations.map((rec) => ({
        id: `${idPrefix}-${rec.id}`,
        issuer: corpus.citation.organization,
        year: corpus.citation.year,
        passage: rec.text,
    }));
}
