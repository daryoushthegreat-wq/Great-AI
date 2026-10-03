// Capture real API responses once, so parser tests can run offline and in CI.
//
// Run on a machine with network access:  npm run capture:fixtures
//
// Every source below is openly licensed and needs no API key at this volume. The saved
// JSON is the contract the parsers are written against — when a provider changes a field,
// re-running this and re-running the tests is what surfaces the break, rather than the
// tools quietly returning nothing.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = new URL('../src/__fixtures__/', import.meta.url).pathname;

// NCBI asks for no more than 3 requests/second without an API key.
const THROTTLE_MS = 400;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TARGETS = [
    {
        name: 'pubmed-esearch',
        url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'
            + '?db=pubmed&retmode=json&retmax=5'
            + '&term=rheumatoid+arthritis+AND+methotrexate',
    },
    {
        name: 'pubmed-esearch-guidelines',
        url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'
            + '?db=pubmed&retmode=json&retmax=5'
            + '&term=rheumatoid+arthritis+AND+guideline%5BPublication+Type%5D',
    },
    {
        name: 'pubmed-esummary',
        // IDs are resolved from the esearch fixture above so the two stay consistent.
        url: null,
        from: 'pubmed-esearch',
        build: (prior) => {
            const ids = prior?.esearchresult?.idlist ?? [];
            if (ids.length === 0) return null;
            return 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'
                + `?db=pubmed&retmode=json&id=${ids.slice(0, 5).join(',')}`;
        },
    },
    {
        name: 'europepmc-guidelines',
        url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
            + '?query=rheumatoid%20arthritis%20AND%20PUB_TYPE%3A%22Practice%20Guideline%22'
            + '&format=json&pageSize=5&resultType=core',
    },
    {
        name: 'openfda-label-warfarin',
        url: 'https://api.fda.gov/drug/label.json'
            + '?search=openfda.generic_name:%22warfarin%22&limit=1',
    },
    {
        name: 'openfda-label-amiodarone',
        url: 'https://api.fda.gov/drug/label.json'
            + '?search=openfda.generic_name:%22amiodarone%22&limit=1',
    },
    {
        name: 'rxnorm-rxcui-warfarin',
        url: 'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=warfarin',
    },
];

async function main() {
    await mkdir(OUT_DIR, { recursive: true });

    const captured = new Map();
    let failures = 0;

    for (const target of TARGETS) {
        const url = target.build ? target.build(captured.get(target.from)) : target.url;
        if (!url) {
            console.error(`skip  ${target.name}: could not build URL from '${target.from}'`);
            failures++;
            continue;
        }

        try {
            const response = await fetch(url, {
                headers: { accept: 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            const body = await response.json();
            captured.set(target.name, body);

            const file = join(OUT_DIR, `${target.name}.json`);
            await writeFile(file, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
            console.log(`ok    ${target.name}`);
        } catch (error) {
            console.error(`FAIL  ${target.name}: ${error.message}`);
            failures++;
        }

        await sleep(THROTTLE_MS);
    }

    console.log(`\n${TARGETS.length - failures}/${TARGETS.length} fixtures captured in ${OUT_DIR}`);
    if (failures > 0) process.exitCode = 1;
}

main();
