// Stopgap until @types/node can be installed. `npm install` currently fails for the
// whole project because package.json declares `testing@^0.4.0`, which is not published
// on the npm registry. Delete this file once that dependency is fixed and @types/node
// is added; these are hand-written minimal shapes, not a substitute for the real types.

declare const console: {
    error(...data: unknown[]): void;
    warn(...data: unknown[]): void;
    log(...data: unknown[]): void;
};

declare module 'node:test' {
    export function describe(name: string, fn: () => void): void;
    export function it(name: string, fn: () => void | Promise<void>): void;
}

declare module 'node:assert/strict' {
    interface Assert {
        equal(actual: unknown, expected: unknown, message?: string): void;
        notEqual(actual: unknown, expected: unknown, message?: string): void;
        deepEqual(actual: unknown, expected: unknown, message?: string): void;
        ok(value: unknown, message?: string): void;
        rejects(fn: () => Promise<unknown>, expected?: RegExp | Error): Promise<void>;
    }
    const assert: Assert;
    export default assert;
}
