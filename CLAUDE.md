# CLAUDE.md — Great-AI Codebase Guide

## Project Overview

Great-AI is a clinical decision support toolkit providing async TypeScript functions for medical research, drug interaction checking, lab result interpretation, and clinical report generation. The codebase is in early development — all tool functions have defined interfaces and input validation but contain stub implementations pending core logic.

## Repository Structure

```
Great-AI/
├── src/
│   ├── tools.ts          # All tool function implementations (primary source)
│   ├── tools.test.ts     # Test suite (node:test)
│   └── __fixtures__/     # Captured API responses (created by capture:fixtures)
├── scripts/
│   └── capture-fixtures.mjs  # Run once with network access to record fixtures
├── tsconfig.json
├── package.json
├── .gitignore
└── CLAUDE.md             # This file
```

## Technology Stack

- **Language:** TypeScript (>=4.0.0)
- **Runtime:** Node.js
- **Dependencies:**
  - `@typesafe-ai/sdk` (^0.6.0) — System One judgments; used by `lab_interpreter`
  - `zod` (>=3.0.0) — schema validation (intended for API response validation)
  - `node-fetch` (>=2.6.0) — declared but unused; Node 18+ has a global `fetch`
  - `typescript` (>=4.0.0) — compiler
  - `@types/node` (dev) — required; `tsconfig` sets `"types": ["node"]`

`tsconfig.json`, `.gitignore` and npm scripts are configured, and `npm install` works.
The unpublished `testing@^0.4.0` dependency was removed — it had been failing the install
for the whole project, which also prevented `@typesafe-ai/sdk` from ever being installed.

Tests use `node:test`, built into Node; there is no separate test framework dependency.

## Source Code: `src/tools.ts`

The single source file exports nine named async tool functions, plus the
`may_quote_passage` / `classify_licence` licence helpers. All tools validate input first:

```typescript
async function tool_name(param: string): Promise<Result> {
    if (!param) throw new Error('Descriptive validation message');
    try {
        // ...
    } catch (error) {
        console.error('Tool name error:', error);
        throw error;
    }
}
```

Tools awaiting an implementation throw `NotImplementedError` rather than returning
`undefined` — a caller must not be able to read "not built yet" as "nothing found".

### Tool Functions

| Function | Parameters | Purpose |
|---|---|---|
| `pubmed_search` | `query: string` | Search PubMed medical literature |
| `guideline_search` | `topic: string` | Search clinical practice guidelines (citations) |
| `guideline_answer_search` | `question: string` | Answer a question from open sources, returning cited verbatim passages |
| `drug_label_lookup` | `drug: string` | Look up regulator-approved drug labelling (openFDA / DailyMed) |
| `drug_interaction_check` | `drugs: string[]` (min 2) | Check interactions between drugs |
| `clinical_calculator` | `formula: string, values: any` | Perform clinical formula calculations |
| `lab_interpreter` | `results: any` | Interpret laboratory test results |
| `generate_clinical_report` | `data: any` | Generate structured clinical reports |
| `generate_pptx` | `content: any` | Generate PowerPoint presentations |

All functions are exported as named exports at the bottom of the file.

## Conventions

### Naming
- Functions use `snake_case` (medical/clinical domain convention)
- Error messages are descriptive and include what was missing: `'Query is required for PubMed search.'`

### Error Handling
Every function validates its input first, then wraps logic in try-catch. The catch block logs to `console.error` and re-throws. **Do not swallow errors.**

### Type Annotations
All tools are fully typed. Use `zod` for runtime validation of external API responses
once it is installable — validating at the boundary means a changed upstream field fails
loudly with a path, instead of the tool silently returning nothing.

### Clinical Safety
Calculations, reference ranges and interaction severities come from code or from the
source record. They are never inferred by a model. AI judgment is confined to semantic
steps — ranking retrieved passages, matching a drug against label prose — and anything
uncertain is surfaced as such rather than resolved by guessing.

### Exports
All functions are exported as named exports at the end of `tools.ts`. Add new functions to the export block.

## Test File: `src/tools.test.ts`

Real suite, run with `npm test` (compiles, then runs Node's built-in test runner).

- Import functions directly: `import { pubmed_search } from './tools.js';` — the `.js`
  extension is required under `NodeNext` module resolution, even from a `.ts` file.
- Uses `node:test` + `node:assert/strict`, not Jest. Nothing to install.
- Cover input validation errors, successful outputs, and edge cases.
- Parser tests should run against `src/__fixtures__/` rather than live network calls, so
  the suite stays deterministic and works in CI.

## Development Setup

```bash
npm run build             # tsc -> dist/
npm run typecheck         # tsc --noEmit
npm test                  # build, then node --test on the compiled suite
npm run capture:fixtures  # record live API responses (needs network access)
```

## Implementing a Tool Function

When implementing a stub function:

1. Keep the existing input validation and try-catch structure
2. Add TypeScript types to parameters and return type
3. Use the global `fetch` (Node 18+) for external HTTP calls. Only use openly licensed
   sources: NCBI E-utilities, openFDA, DailyMed, RxNorm. Proprietary monograph providers
   must not be scraped or mirrored.
4. Use `zod` to validate external API response shapes
5. Return a well-typed result object
6. Write tests in `tools.test.ts` that cover valid input, invalid input, and edge cases

Example pattern for an HTTP-based tool:
Keep the network call thin and the parsing pure, so the logic is testable against
`src/__fixtures__/` without network access:

```typescript
import { z } from 'zod';

const EsearchSchema = z.object({
    esearchresult: z.object({ idlist: z.array(z.string()) }),
});

// Pure, and covered by tests that read the fixture.
export function parse_pubmed_search(body: unknown): string[] {
    return EsearchSchema.parse(body).esearchresult.idlist;
}

async function pubmed_search(query: string): Promise<string[]> {
    if (!query) throw new Error('Query is required for PubMed search.');
    try {
        const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/...`);
        if (!response.ok) throw new Error(`PubMed returned HTTP ${response.status}`);
        return parse_pubmed_search(await response.json());
    } catch (error) {
        console.error('PubMed search error:', error);
        throw error;
    }
}
```

## Git Workflow

- Feature branch: `claude/install-typesafe-skill-q70ajh`
- Remote: `daryoushthegreat-wq/Great-AI`
- Commit with descriptive messages describing intent, not just what changed
- Push with: `git push -u origin <branch-name>`

## Known Issues / TODOs

1. **`lab_interpreter` decides severity with a model, including `critical`.** It sends the
   value and reference range to a TypeSafe Score judgment and returns whatever level comes
   back. Two consequences worth weighing: whether a value sits outside its reference range
   is arithmetic that cannot be wrong, but is currently delegated; and `referenceLow` /
   `referenceHigh` are optional, so with neither supplied the model is judging against a
   range it has inferred. There is no deterministic floor and no confidence threshold, so a
   `critical` value scored as `mildly_abnormal` fails silently. Consider computing the
   in/out-of-range flag in code and treating the model's severity as an advisory overlay.
2. **Network-backed tools are unimplemented** — `pubmed_search`, `guideline_search`,
   `guideline_answer_search`, `drug_label_lookup` and `drug_interaction_check` throw
   `NotImplementedError`. They need an environment with outbound access to NCBI, Europe
   PMC, openFDA and RxNorm; run `npm run capture:fixtures` there first, then write the
   parsers against the recorded fixtures.
3. **`clinical_calculator` is implemented** and covered by tests — six formulas, with an
   unrecognised formula rejected rather than approximated.
4. **`lab_interpreter` has no test coverage beyond input validation.** The TypeSafe client
   is constructed by a module-level lazy getter, so there is no seam to stub it. Injecting
   the client would make the mapping logic testable.
