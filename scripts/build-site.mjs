// scripts/build-site.mjs
//
// Builds site/index.html: a static browser over the guideline corpora. Run `npm run build:site`.
//
// Data goes through the same validated loaders the toolkit uses (from dist/), so the page
// cannot show a recommendation that failed validation, and restricted text is never read.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { parse_open_guideline_corpus, corpus_citation } = require(path.join(root, 'dist/guideline_corpus.js'));
const { select_restricted_citations } = require(path.join(root, 'dist/guideline_ranking.js'));
const { SITUATIONS, match_open_recommendations } = require(path.join(root, 'dist/guideline_routing.js'));

const fixture = (name) =>
    JSON.parse(readFileSync(path.join(root, 'src/__fixtures__/guidelines', name), 'utf8'));

const vadod = parse_open_guideline_corpus(fixture('vadod-2023-t2d.json'));
const ada = fixture('ada-2026-t2d.json');
const adaCitation = {
    title: ada.citation.title,
    organization: ada.citation.organization,
    year: ada.citation.year,
    url: ada.citation.url,
    source: { name: ada.citation.organization, url: ada.citation.url, licence: ada.citation.licence, retrievedAt: '2026-11-18T00:00:00Z' },
};

const isDrug = (r) => r.topicAsStated === 'Pharmacotherapy' || r.subTopicAsStated === 'Pharmacotherapy';

const adaFor = (tags) => {
    const ids = new Set();
    for (const tag of tags) {
        for (const c of select_restricted_citations(ada.recommendations, adaCitation, tag)) ids.add(c.recommendationId);
    }
    return ada.recommendations.filter((r) => ids.has(r.id)).map((r) => r.id);
};

const data = {
    vadod: {
        citation: { ...vadod.citation, display: corpus_citation(vadod).title },
        recommendations: vadod.recommendations.map((r) => ({ ...r, drug: isDrug(r) })),
    },
    ada: {
        citation: ada.citation,
        // Ids and grades only. ADA's `topic` strings are our routing labels, not its wording.
        recommendations: ada.recommendations.map(({ id, evidenceGradeAsStated, comorbidities }) => ({ id, evidenceGradeAsStated, comorbidities })),
    },
    situations: [
        {
            id: 'all',
            label: 'All drug recommendations',
            vadod: vadod.recommendations.map((r) => ({ id: r.id, phrases: [] })),
            ada: ada.recommendations.map((r) => r.id),
        },
        ...SITUATIONS.map((s) => ({
            id: s.id,
            label: s.label,
            vadod: match_open_recommendations(vadod, s).map((m) => ({ id: m.recommendation.id, phrases: m.matchedPhrases })),
            ada: adaFor(s.restrictedTags),
        })),
    ],
    builtAt: new Date().toISOString().slice(0, 10),
};

const json = JSON.stringify(data).replace(/</g, '\\u003c');
const template = readFileSync(path.join(root, 'scripts/site-template.html'), 'utf8');
if (!template.includes('/*__DATA__*/null')) throw new Error('Template is missing the data placeholder.');
mkdirSync(path.join(root, 'site'), { recursive: true });
writeFileSync(path.join(root, 'site/index.html'), template.replace('/*__DATA__*/null', json));
console.log(`site/index.html: ${data.vadod.recommendations.length} VA/DoD, ${data.ada.recommendations.length} ADA, ${data.situations.length} situations`);
