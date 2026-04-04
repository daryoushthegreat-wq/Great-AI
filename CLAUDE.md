# CLAUDE.md — Great-AI Codebase Guide

## Project Overview

Great-AI is a clinical decision support toolkit providing async TypeScript functions for medical research, drug interaction checking, lab result interpretation, and clinical report generation. The codebase is in early development — all tool functions have defined interfaces and input validation but contain stub implementations pending core logic.

## Repository Structure

```
Great-AI/
├── src/
│   ├── tools.ts          # All 8 tool function implementations (primary source)
│   └── tools.test.ts     # Test suite (placeholder — currently misaligned with tools.ts)
├── package.json          # Dependencies only; no scripts configured
└── CLAUDE.md             # This file
```

## Technology Stack

- **Language:** TypeScript (>=4.0.0)
- **Runtime:** Node.js
- **Dependencies:**
  - `zod` (>=3.0.0) — schema validation (intended for input validation)
  - `node-fetch` (>=2.6.0) — HTTP client for external API calls
  - `testing` (^0.4.0) — test framework
  - `typescript` (>=4.0.0) — compiler

**Missing configuration files that need to be created before developing:**
- `tsconfig.json` — TypeScript compiler config
- A test script entry in `package.json`
- `.gitignore`

## Source Code: `src/tools.ts`

The single source file exports 8 named async functions. All follow the same pattern:

```typescript
async function tool_name(param) {
    if (!param) throw new Error('Descriptive validation message');
    try {
        // Implement logic here
    } catch (error) {
        console.error('Tool name error:', error);
        throw error;
    }
}
```

### Tool Functions

| Function | Parameters | Purpose |
|---|---|---|
| `pubmed_search` | `query: string` | Search PubMed medical literature |
| `guideline_search` | `topic: string` | Search clinical practice guidelines |
| `medscape_lookup` | `drug: string` | Look up drug information on Medscape |
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
The current code lacks TypeScript type annotations despite using TypeScript. When implementing functions, add proper types — use `zod` for runtime validation of external API responses and complex inputs.

### Exports
All functions are exported as named exports at the end of `tools.ts`. Add new functions to the export block.

## Test File: `src/tools.test.ts`

**The test file is currently a placeholder and does not match the actual implementation.** It imports a non-existent `clinicalTools` default export and tests non-existent `toolA`/`toolB` functions.

When writing real tests:
- Import functions directly: `import { pubmed_search, drug_interaction_check } from './tools';`
- Test input validation errors (pass empty/invalid inputs, expect thrown errors)
- Test successful outputs when logic is implemented
- The test framework supports Jest-style `describe`/`it`/`expect` syntax

## Development Setup

There are no configured npm scripts. To run TypeScript manually:

```bash
npx tsc           # compile
npx ts-node src/tools.ts   # run directly
```

To run tests (once a test script is configured in package.json):
```bash
npm test
```

**Recommended: add these to `package.json`:**
```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest --testPathPattern='src/.*\\.test\\.ts'",
    "dev": "ts-node src/tools.ts"
  }
}
```

## Implementing a Tool Function

When implementing a stub function:

1. Keep the existing input validation and try-catch structure
2. Add TypeScript types to parameters and return type
3. Use `node-fetch` for external HTTP calls (PubMed API, Medscape, etc.)
4. Use `zod` to validate external API response shapes
5. Return a well-typed result object
6. Write tests in `tools.test.ts` that cover valid input, invalid input, and edge cases

Example pattern for an HTTP-based tool:
```typescript
import fetch from 'node-fetch';
import { z } from 'zod';

const PubmedResultSchema = z.object({ ... });

async function pubmed_search(query: string): Promise<PubmedResult[]> {
    if (!query) throw new Error('Query is required for PubMed search.');
    try {
        const response = await fetch(`https://...`);
        const data = await response.json();
        return PubmedResultSchema.array().parse(data);
    } catch (error) {
        console.error('PubMed search error:', error);
        throw error;
    }
}
```

## Git Workflow

- Feature branch: `claude/add-claude-documentation-aowWK`
- Remote: `daryoushthegreat-wq/Great-AI`
- Commit with descriptive messages describing intent, not just what changed
- Push with: `git push -u origin <branch-name>`

## Known Issues / TODOs

1. **All tool functions are stubs** — logic marked `// Implement X logic here` needs to be written
2. **`tools.test.ts` is misaligned** — imports and test cases don't match `tools.ts` exports; rewrite before running tests
3. **No `tsconfig.json`** — TypeScript compilation is not configured; add before building
4. **No type annotations** — parameters and return types are implicit `any`; add proper types when implementing
5. **No npm scripts** — `package.json` has no `scripts` field; add `build`, `test`, `dev`
6. **No `.gitignore`** — `node_modules/`, `dist/`, and `.env` files should be excluded
