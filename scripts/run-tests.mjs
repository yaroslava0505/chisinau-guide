/**
 * Runs every `tests/*.test.ts` file through tsx and aggregates the results.
 *
 * Each test file prints its own PASS/FAIL lines and ends with a summary
 * sentence; a file is considered failed if it exits non-zero or its output
 * mentions a failing case.
 */
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const testsDir = resolve(here, '..', 'tests');

const files = readdirSync(testsDir).filter((f) => f.endsWith('.test.ts')).sort();
const verbose = process.argv.includes('--verbose');

let failed = 0;

for (const file of files) {
  const result = spawnSync('npx', ['tsx', join(testsDir, file)], { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}`;
  const summary = output.trim().split('\n').filter(Boolean).pop() ?? '(no output)';
  const ok = result.status === 0 && !/failing case/.test(output);

  if (!ok) failed += 1;
  console.log(`${ok ? '✓' : '✗'} ${file.padEnd(24)} ${summary}`);
  if (verbose || !ok) {
    console.log(output.split('\n').map((l) => `    ${l}`).join('\n'));
    if (result.stderr && !ok) console.log(result.stderr);
  }
}

console.log(
  failed === 0
    ? `\n${files.length} test files passed.`
    : `\n${failed} of ${files.length} test files failed.`,
);
process.exit(failed === 0 ? 0 : 1);
