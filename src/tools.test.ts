// src/tools.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
    clinical_calculator,
    drug_interaction_check,
    generate_clinical_report,
    generate_pptx,
    classify_licence,
    drug_label_lookup,
    guideline_answer_search,
    guideline_search,
    lab_interpreter,
    may_quote_passage,
    pubmed_search,
} from './tools.js';

describe('clinical_calculator', () => {
    it('computes BMI from weight and height', async () => {
        const result = await clinical_calculator('bmi', { weight_kg: 70, height_cm: 175 });
        assert.equal(result.value, 22.86);
        assert.equal(result.unit, 'kg/m^2');
        assert.equal(result.formula, 'bmi');
    });

    it('computes body surface area using Mosteller', async () => {
        const result = await clinical_calculator('bsa_mosteller', { weight_kg: 70, height_cm: 175 });
        assert.equal(result.value, 1.84);
    });

    it('computes mean arterial pressure', async () => {
        const result = await clinical_calculator('map', { systolic_mmHg: 120, diastolic_mmHg: 80 });
        assert.equal(result.value, 93.33);
    });

    it('computes Cockcroft-Gault and applies the female coefficient', async () => {
        const base = { age_years: 60, weight_kg: 70, creatinine_mg_dL: 1.0 };
        const male = await clinical_calculator('cockcroft_gault', { ...base, sex: 'male' });
        const female = await clinical_calculator('cockcroft_gault', { ...base, sex: 'female' });
        assert.equal(male.value, 77.78);
        assert.equal(female.value, 66.11);
    });

    it('computes the anion gap', async () => {
        const result = await clinical_calculator('anion_gap', {
            sodium_mmol_L: 140,
            chloride_mmol_L: 104,
            bicarbonate_mmol_L: 24,
        });
        assert.equal(result.value, 12);
    });

    it('computes albumin-corrected calcium', async () => {
        const result = await clinical_calculator('corrected_calcium', {
            calcium_mg_dL: 8.0,
            albumin_g_dL: 3.0,
        });
        assert.equal(result.value, 8.8);
    });

    it('normalises formula name casing and numeric strings', async () => {
        const result = await clinical_calculator(' BMI ', { weight_kg: '70', height_cm: '175' });
        assert.equal(result.value, 22.86);
    });

    it('rejects an unsupported formula instead of approximating one', async () => {
        await assert.rejects(
            () => clinical_calculator('egfr', { creatinine_mg_dL: 1 }),
            /Unsupported formula/,
        );
    });

    it('rejects a missing parameter', async () => {
        await assert.rejects(
            () => clinical_calculator('bmi', { weight_kg: 70 }),
            /Missing required parameter 'height_cm'/,
        );
    });

    it('rejects a non-numeric parameter', async () => {
        await assert.rejects(
            () => clinical_calculator('bmi', { weight_kg: 'heavy', height_cm: 175 }),
            /must be a finite number/,
        );
    });

    it('rejects a non-positive physiological value', async () => {
        await assert.rejects(
            () => clinical_calculator('bmi', { weight_kg: -70, height_cm: 175 }),
            /outside the plausible range/,
        );
    });

    it('rejects an implausible magnitude, which is usually a unit error', async () => {
        // 82000 kg previously produced a BMI of 25880 without complaint.
        await assert.rejects(
            () => clinical_calculator('bmi', { weight_kg: 82000, height_cm: 175 }),
            /outside the plausible range 0.2-650/,
        );
    });

    it('rejects an age that would make creatinine clearance negative', async () => {
        // age 900 previously returned -618 mL/min as a valid result.
        await assert.rejects(
            () =>
                clinical_calculator('cockcroft_gault', {
                    age_years: 900,
                    weight_kg: 82,
                    creatinine_mg_dL: 1.4,
                    sex: 'male',
                }),
            /outside the plausible range 0-130/,
        );
    });

    it('still accepts unusual but real patients', async () => {
        const neonate = await clinical_calculator('bmi', { weight_kg: 3.2, height_cm: 50 });
        assert.equal(neonate.value, 12.8);
        const elder = await clinical_calculator('cockcroft_gault', {
            age_years: 103,
            weight_kg: 48,
            creatinine_mg_dL: 1.1,
            sex: 'female',
        });
        assert.ok(elder.value > 0, 'clearance should stay positive for a 103-year-old');
    });

    it('rejects an out-of-range choice parameter', async () => {
        await assert.rejects(
            () =>
                clinical_calculator('cockcroft_gault', {
                    age_years: 60,
                    weight_kg: 70,
                    creatinine_mg_dL: 1.0,
                    sex: 'unspecified',
                }),
            /must be one of: male, female/,
        );
    });

    it('rejects empty arguments', async () => {
        await assert.rejects(() => clinical_calculator('', {}), /required/);
    });
});

describe('licence gate', () => {
    it('permits quoting openly licensed records', () => {
        for (const licence of ['CC0 1.0', 'CC BY 4.0', 'cc-by-sa', 'Public Domain', 'CC BY-ND 4.0']) {
            assert.equal(may_quote_passage(licence), true, licence);
        }
    });

    it('withholds non-commercial text unless non-commercial use is permitted', () => {
        for (const licence of ['CC BY-NC 4.0', 'CC BY-NC-SA', 'CC BY-NC-ND 4.0']) {
            assert.equal(classify_licence(licence), 'non-commercial', licence);
            assert.equal(may_quote_passage(licence), false, licence);
            assert.equal(may_quote_passage(licence, { allowNonCommercial: true }), true, licence);
        }
    });

    it('fails closed on missing, empty or unrecognised licences', () => {
        assert.equal(may_quote_passage(undefined), false);
        assert.equal(may_quote_passage(''), false);
        assert.equal(may_quote_passage('All rights reserved'), false);
        assert.equal(may_quote_passage('© American College of Rheumatology'), false);
        assert.equal(classify_licence('subscription required'), 'restricted');
    });

    it('does not let a non-commercial licence match the permissive rule', () => {
        // 'CC BY-NC' contains 'CC BY'; rule order is what prevents the wrong verdict.
        assert.notEqual(classify_licence('CC BY-NC 4.0'), 'open');
    });
});

describe('input validation', () => {
    it('requires a query for pubmed_search', async () => {
        await assert.rejects(() => pubmed_search(''), /Query is required/);
    });

    it('requires a topic for guideline_search', async () => {
        await assert.rejects(() => guideline_search(''), /Topic is required/);
    });

    it('requires a non-blank question for guideline_answer_search', async () => {
        await assert.rejects(() => guideline_answer_search(''), /question is required/);
        await assert.rejects(() => guideline_answer_search('   '), /question is required/);
    });

    it('requires a drug name for drug_label_lookup', async () => {
        await assert.rejects(() => drug_label_lookup(''), /Drug name is required/);
    });

    it('requires at least two drugs for an interaction check', async () => {
        await assert.rejects(() => drug_interaction_check(['warfarin']), /At least two drugs/);
    });

    it('requires a non-empty result set for lab_interpreter', async () => {
        await assert.rejects(() => lab_interpreter([]), /Lab results are required/);
    });
});

// Stale guidance should fail the build, not mislead silently — the same argument that
// makes the stubs below throw instead of resolving `undefined`. CLAUDE.md's tool table
// previously still described `medscape_lookup` after the code had renamed it, which costs
// a reader a wasted file read and some misplaced confidence.
describe('CLAUDE.md stays in sync with the code', () => {
    // Tests run from dist/, so the repo root is one level up from the compiled file.
    const repoRoot = path.resolve(__dirname, '..');
    const read = (relative: string) => readFileSync(path.join(repoRoot, relative), 'utf8');

    /** Names in the `export { ... };` block at the bottom of src/tools.ts. */
    function exportedToolNames(source: string): string[] {
        const blocks = [...source.matchAll(/export\s*\{([^}]*)\};/g)];
        assert.equal(blocks.length, 1, 'expected exactly one `export { ... };` block');
        return (blocks[0]?.[1] ?? '')
            .split(',')
            .map((name) => name.trim())
            .filter((name) => name.length > 0)
            .sort();
    }

    /** Backticked names in the first column of the Tool Functions table. */
    function documentedToolNames(doc: string): string[] {
        const section = doc.split('### Tool Functions')[1]?.split('\n## ')[0] ?? '';
        return [...section.matchAll(/^\|\s*`([a-z_]+)`\s*\|/gm)]
            .map((match) => match[1] as string)
            .sort();
    }

    it('documents every exported tool, and no tool that does not exist', () => {
        const exported = exportedToolNames(read('src/tools.ts'));
        const documented = documentedToolNames(read('CLAUDE.md'));

        assert.ok(exported.length > 0, 'parsed no exports — the regex is probably stale');
        assert.ok(documented.length > 0, 'parsed no table rows — the table format changed');
        assert.deepEqual(
            documented,
            exported,
            'CLAUDE.md tool table and the tools.ts export block disagree',
        );
    });

    it('does not describe the toolkit with `any`', () => {
        // `values: any` in the table is worse than no table: it costs a read and tells the
        // reader nothing. The real types are exported, so name them.
        const section = read('CLAUDE.md').split('### Tool Functions')[1]?.split('\n## ')[0] ?? '';
        const rows = section.split('\n').filter((line) => /^\|\s*`[a-z_]+`\s*\|/.test(line));
        for (const row of rows) {
            assert.ok(!/\bany\b/.test(row), `tool table row still uses \`any\`: ${row.trim()}`);
        }
    });
});

// A stub must fail loudly. Previously each of these resolved to `undefined`, which a
// caller could mistake for "no findings" — the wrong failure mode for a clinical tool.
describe('unimplemented tools fail loudly', () => {
    it('rejects rather than resolving undefined', async () => {
        await assert.rejects(() => pubmed_search('sepsis'), /not implemented/);
        await assert.rejects(() => guideline_search('sepsis'), /not implemented/);
        await assert.rejects(
            () => guideline_answer_search('First-line DMARD in rheumatoid arthritis?'),
            /not implemented/,
        );
        await assert.rejects(() => drug_label_lookup('warfarin'), /not implemented/);
        await assert.rejects(() => drug_interaction_check(['warfarin', 'aspirin']), /not implemented/);
        await assert.rejects(() => generate_clinical_report({ patient: 'x' }), /not implemented/);
        await assert.rejects(() => generate_pptx({ slides: [] }), /not implemented/);
    });
});
