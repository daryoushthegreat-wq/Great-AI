// src/guideline_routing.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parse_open_guideline_corpus } from './guideline_corpus.js';
import { find_situation, match_open_recommendations, SITUATIONS } from './guideline_routing.js';

const repoRoot = path.resolve(__dirname, '..');
const read_fixture = (name: string): unknown =>
    JSON.parse(readFileSync(path.join(repoRoot, 'src/__fixtures__/guidelines', name), 'utf8'));
const vadod = parse_open_guideline_corpus(read_fixture('vadod-2023-t2d.json'));
const adaTags = new Set(
    (read_fixture('ada-2026-t2d.json') as { recommendations: Array<{ comorbidities: string[] }> })
        .recommendations.flatMap((r) => r.comorbidities),
);

const ids = (situationId: string) =>
    match_open_recommendations(vadod, find_situation(situationId)).map((m) => m.recommendation.id);

describe('situation routing over the VA/DoD corpus', () => {
    it('selects the recommendations whose own text names the situation', () => {
        assert.deepEqual(ids('ascvd'), ['19', '24']);
        assert.deepEqual(ids('cv-risk'), ['20']);
        assert.deepEqual(ids('heart-failure'), ['20', '21']);
        assert.deepEqual(ids('ckd'), ['20', '22', '23', '24']);
        assert.deepEqual(ids('older'), ['25']);
        assert.deepEqual(ids('cognition-falls'), ['6', '26']);
    });

    it('returns nothing rather than a near miss when the corpus is silent', () => {
        assert.deepEqual(ids('obesity'), []);
    });

    it('reports which phrase matched, so the page can show why', () => {
        const [match] = match_open_recommendations(vadod, find_situation('heart-failure'));
        assert.deepEqual(match?.matchedPhrases, ['heart failure']);
    });

    it('uses only phrases that are lower case, since matching lower-cases the text', () => {
        for (const s of SITUATIONS) for (const p of s.phrases) assert.equal(p, p.toLowerCase());
    });

    it('refers only to comorbidity tags the ADA corpus actually uses', () => {
        for (const s of SITUATIONS) {
            for (const tag of s.restrictedTags) assert.ok(adaTags.has(tag), `${s.id}: unknown tag ${tag}`);
        }
    });

    it('rejects an unknown situation', () => {
        assert.throws(() => find_situation('gout'), /Unknown situation 'gout'/);
    });
});
