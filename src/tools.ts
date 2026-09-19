// tools.ts
//
// Architecture follows the TypeSafe "System One" split: known rules, calculations
// and exact lookups stay in code; AI judgment is reserved for semantic steps
// (routing a free-text request to a formula, ranking literature, narrative prose).
// The semantic layer is not wired up yet — docs.typesafe.ai and the SDK are
// unreachable from this environment, and guessing the API contract in a clinical
// tool is worse than leaving the seam explicit.

/** Raised when a tool has a defined interface but no implementation yet. */
export class NotImplementedError extends Error {
    constructor(tool: string, reason: string) {
        super(`${tool} is not implemented: ${reason}`);
        this.name = 'NotImplementedError';
    }
}

export interface PubMedArticle {
    pmid: string;
    title: string;
    journal?: string;
    year?: number;
}

export interface Guideline {
    title: string;
    organization: string;
    year?: number;
    url?: string;
}

export interface DrugMonograph {
    drug: string;
    summary: string;
    source: string;
}

export interface DrugInteraction {
    drugs: [string, string];
    severity: string;
    description: string;
    source: string;
}

export interface InteractionReport {
    checked: string[];
    interactions: DrugInteraction[];
    source: string;
}

export interface LabResult {
    analyte: string;
    value: number;
    unit: string;
}

export interface LabInterpretation extends LabResult {
    flag: 'low' | 'normal' | 'high';
    referenceRange: string;
}

// Tool for searching PubMed articles
async function pubmed_search(query: string): Promise<PubMedArticle[]> {
    if (!query) throw new Error('Query is required for PubMed search.');
    throw new NotImplementedError(
        'pubmed_search',
        'requires access to the NCBI E-utilities API, which is blocked by the network egress policy.',
    );
}

// Tool for searching guidelines
async function guideline_search(topic: string): Promise<Guideline[]> {
    if (!topic) throw new Error('Topic is required for guidelines search.');
    throw new NotImplementedError(
        'guideline_search',
        'requires an authoritative guideline source to be selected and reachable.',
    );
}

// Tool for looking up information on Medscape
async function medscape_lookup(drug: string): Promise<DrugMonograph> {
    if (!drug) throw new Error('Drug name is required for Medscape lookup.');
    throw new NotImplementedError(
        'medscape_lookup',
        'requires a licensed Medscape/drug-monograph data source; monograph text must not be synthesised.',
    );
}

// Tool for drug interaction checking
async function drug_interaction_check(drugs: string[]): Promise<InteractionReport> {
    if (!Array.isArray(drugs) || drugs.length < 2) {
        throw new Error('At least two drugs are required for interaction check.');
    }
    throw new NotImplementedError(
        'drug_interaction_check',
        'interaction pairs and severities must come from an authoritative database (e.g. RxNorm/DrugBank), never from model inference.',
    );
}

export type ClinicalFormula =
    | 'bmi'
    | 'bsa_mosteller'
    | 'map'
    | 'cockcroft_gault'
    | 'anion_gap'
    | 'corrected_calcium';

export type CalculatorValues = Record<string, number | string | undefined>;

export interface CalculatorResult {
    formula: ClinicalFormula;
    label: string;
    value: number;
    unit: string;
    inputs: Record<string, number | string>;
}

type NumericParam = (param: string) => number;
type ChoiceParam = (param: string) => string;

interface FormulaSpec {
    label: string;
    unit: string;
    numeric: readonly string[];
    choice?: { param: string; allowed: readonly string[] };
    compute: (num: NumericParam, choice: ChoiceParam) => number;
}

// Every supported formula is an explicit, deterministic definition. An unrecognised
// formula is rejected rather than approximated.
const FORMULAS: Record<ClinicalFormula, FormulaSpec> = {
    bmi: {
        label: 'Body mass index',
        unit: 'kg/m^2',
        numeric: ['weight_kg', 'height_cm'],
        compute: (num) => num('weight_kg') / (num('height_cm') / 100) ** 2,
    },
    bsa_mosteller: {
        label: 'Body surface area (Mosteller)',
        unit: 'm^2',
        numeric: ['weight_kg', 'height_cm'],
        compute: (num) => Math.sqrt((num('height_cm') * num('weight_kg')) / 3600),
    },
    map: {
        label: 'Mean arterial pressure',
        unit: 'mmHg',
        numeric: ['systolic_mmHg', 'diastolic_mmHg'],
        compute: (num) =>
            num('diastolic_mmHg') + (num('systolic_mmHg') - num('diastolic_mmHg')) / 3,
    },
    cockcroft_gault: {
        label: 'Creatinine clearance (Cockcroft-Gault)',
        unit: 'mL/min',
        numeric: ['age_years', 'weight_kg', 'creatinine_mg_dL'],
        choice: { param: 'sex', allowed: ['male', 'female'] },
        compute: (num, choice) => {
            const clearance =
                ((140 - num('age_years')) * num('weight_kg')) /
                (72 * num('creatinine_mg_dL'));
            return choice('sex') === 'female' ? clearance * 0.85 : clearance;
        },
    },
    anion_gap: {
        label: 'Anion gap',
        unit: 'mmol/L',
        numeric: ['sodium_mmol_L', 'chloride_mmol_L', 'bicarbonate_mmol_L'],
        compute: (num) =>
            num('sodium_mmol_L') - (num('chloride_mmol_L') + num('bicarbonate_mmol_L')),
    },
    corrected_calcium: {
        label: 'Albumin-corrected calcium',
        unit: 'mg/dL',
        numeric: ['calcium_mg_dL', 'albumin_g_dL'],
        compute: (num) => num('calcium_mg_dL') + 0.8 * (4.0 - num('albumin_g_dL')),
    },
};

function isClinicalFormula(value: string): value is ClinicalFormula {
    return Object.prototype.hasOwnProperty.call(FORMULAS, value);
}

// Tool for clinical calculations
async function clinical_calculator(
    formula: string,
    values: CalculatorValues,
): Promise<CalculatorResult> {
    if (!formula || !values) throw new Error('Formula and values are required for clinical calculation.');
    try {
        const key = formula.trim().toLowerCase();
        if (!isClinicalFormula(key)) {
            throw new Error(
                `Unsupported formula '${formula}'. Supported formulas: ${Object.keys(FORMULAS).join(', ')}.`,
            );
        }

        const spec = FORMULAS[key];
        const inputs: Record<string, number | string> = {};

        for (const param of spec.numeric) {
            const raw = values[param];
            if (raw === undefined || raw === null || raw === '') {
                throw new Error(`Missing required parameter '${param}' for ${key}.`);
            }
            const parsed = typeof raw === 'number' ? raw : Number(raw);
            if (!Number.isFinite(parsed)) {
                throw new Error(`Parameter '${param}' for ${key} must be a finite number.`);
            }
            // Every parameter in this registry is a physiological quantity, so a
            // non-positive value indicates a unit or data-entry error.
            if (parsed <= 0) {
                throw new Error(`Parameter '${param}' for ${key} must be greater than zero.`);
            }
            inputs[param] = parsed;
        }

        if (spec.choice) {
            const raw = values[spec.choice.param];
            const parsed = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
            if (!spec.choice.allowed.includes(parsed)) {
                throw new Error(
                    `Parameter '${spec.choice.param}' for ${key} must be one of: ${spec.choice.allowed.join(', ')}.`,
                );
            }
            inputs[spec.choice.param] = parsed;
        }

        const num: NumericParam = (param) => inputs[param] as number;
        const choice: ChoiceParam = (param) => inputs[param] as string;
        const value = spec.compute(num, choice);

        if (!Number.isFinite(value)) {
            throw new Error(`Calculation for ${key} produced a non-finite result.`);
        }

        return {
            formula: key,
            label: spec.label,
            value: Math.round(value * 100) / 100,
            unit: spec.unit,
            inputs,
        };
    } catch (error) {
        console.error('Clinical calculator error:', error);
        throw error;
    }
}

// Tool for interpreting lab results
async function lab_interpreter(results: LabResult[]): Promise<LabInterpretation[]> {
    if (!results) throw new Error('Lab results are required for interpretation.');
    throw new NotImplementedError(
        'lab_interpreter',
        'reference ranges are assay- and population-specific and must be sourced from the reporting laboratory.',
    );
}

// Tool for generating clinical reports
async function generate_clinical_report(data: Record<string, unknown>): Promise<string> {
    if (!data) throw new Error('Data is required to generate a clinical report.');
    throw new NotImplementedError(
        'generate_clinical_report',
        'report assembly depends on the upstream tools above returning real data.',
    );
}

// Tool for generating PPTX presentations
async function generate_pptx(content: Record<string, unknown>): Promise<Uint8Array> {
    if (!content) throw new Error('Content is required to generate a PPTX.');
    throw new NotImplementedError(
        'generate_pptx',
        'requires a PPTX writer dependency to be selected and installed.',
    );
}

export {
    pubmed_search,
    guideline_search,
    medscape_lookup,
    drug_interaction_check,
    clinical_calculator,
    lab_interpreter,
    generate_clinical_report,
    generate_pptx,
};
