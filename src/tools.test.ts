// src/tools.test.ts

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
    clinical_calculator,
    drug_interaction_check,
    generate_clinical_report,
    generate_pptx,
    drug_label_lookup,
    guideline_search,
    lab_interpreter,
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
            /must be greater than zero/,
        );
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

describe('input validation', () => {
    it('requires a query for pubmed_search', async () => {
        await assert.rejects(() => pubmed_search(''), /Query is required/);
    });

    it('requires a topic for guideline_search', async () => {
        await assert.rejects(() => guideline_search(''), /Topic is required/);
    });

    it('requires a drug name for drug_label_lookup', async () => {
        await assert.rejects(() => drug_label_lookup(''), /Drug name is required/);
    });

    it('requires at least two drugs for an interaction check', async () => {
        await assert.rejects(() => drug_interaction_check(['warfarin']), /At least two drugs/);
    });
});

// A stub must fail loudly. Previously each of these resolved to `undefined`, which a
// caller could mistake for "no findings" — the wrong failure mode for a clinical tool.
describe('unimplemented tools fail loudly', () => {
    it('rejects rather than resolving undefined', async () => {
        await assert.rejects(() => pubmed_search('sepsis'), /not implemented/);
        await assert.rejects(() => guideline_search('sepsis'), /not implemented/);
        await assert.rejects(() => drug_label_lookup('warfarin'), /not implemented/);
        await assert.rejects(() => drug_interaction_check(['warfarin', 'aspirin']), /not implemented/);
        await assert.rejects(() => lab_interpreter([{ analyte: 'Na', value: 140, unit: 'mmol/L' }]), /not implemented/);
        await assert.rejects(() => generate_clinical_report({ patient: 'x' }), /not implemented/);
        await assert.rejects(() => generate_pptx({ slides: [] }), /not implemented/);
    });
});
