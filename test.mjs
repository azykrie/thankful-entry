import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ENTRY_TEXT, validateEntryText, writeEntry } from './main.ts';

const root = dirname(fileURLToPath(import.meta.url));
const scratch = process.env.TMPDIR ?? join(homedir(), '.hermes', 'cache', 'scratch');
mkdirSync(scratch, { recursive: true });
const runRoot = mkdtempSync(join(scratch, 'thankful-tests-'));
const entrypoint = join(root, 'main.ts');
const expected = Buffer.from(ENTRY_TEXT, 'utf8');
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

function execute(output, args = [], cwd = root) {
  const result = spawnSync(process.execPath, [...args, '--experimental-strip-types', entrypoint], {
    cwd, env: { ...process.env, OUTPUT_DIR: output }, encoding: 'utf8', timeout: 5000,
  });
  assert.ifError(result.error);
  return result;
}

test('fresh text thanks its reader and keeps the imagined pencil scene', () => {
  validateEntryText(ENTRY_TEXT);
  assert.match(ENTRY_TEXT, /^Thank you for reading/);
  for (const phrase of ['I picture', 'blue river', 'pencil', 'a little harder']) {
    assert.ok(ENTRY_TEXT.includes(phrase));
  }
});

for (const [label, value] of [
  ['one ASCII point', 'x'], ['1000 ASCII points', 'x'.repeat(1000)],
  ['1000 astral points', '🌿'.repeat(1000)], ['1000 combining points', 'e\u0301'.repeat(500)],
]) {
  test(`accepts ${label}`, () => assert.doesNotThrow(() => validateEntryText(value)));
}

for (const [label, value] of [
  ['empty text', ''], ['Unicode whitespace', ' \n\t\r\u00a0\u2003'],
  ['1001 ASCII points', 'x'.repeat(1001)], ['1001 astral points', '🌿'.repeat(1001)],
  ['1002 combining points', 'e\u0301'.repeat(501)],
  ['lone high surrogate', '\ud800'], ['lone low surrogate', '\udc00'],
]) {
  test(`rejects ${label}`, () => assert.throws(() => validateEntryText(value)));
}

test('writes only entry.txt, exact strict UTF-8 with no BOM, in a nested Unicode path', () => {
  const dir = join(runRoot, 'nested', 'space and 河');
  const file = writeEntry(dir);
  assert.equal(file, join(dir, 'entry.txt'));
  assert.deepEqual(readdirSync(dir), ['entry.txt']);
  const bytes = readFileSync(file);
  assert.deepEqual(bytes, expected);
  assert.equal(new TextDecoder('utf-8', { fatal: true }).decode(bytes), ENTRY_TEXT);
  assert.notDeepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
});

test('replaces an older longer file completely on repeated writes', () => {
  const dir = join(runRoot, 'overwrite');
  mkdirSync(dir);
  writeFileSync(join(dir, 'entry.txt'), 'obsolete'.repeat(1000));
  writeEntry(dir);
  writeEntry(dir);
  assert.deepEqual(readFileSync(join(dir, 'entry.txt')), expected);
});

test('OUTPUT_DIR default argument uses the live environment', () => {
  const previous = process.env.OUTPUT_DIR;
  const dir = join(runRoot, 'environment');
  try {
    process.env.OUTPUT_DIR = dir;
    assert.equal(writeEntry(), join(dir, 'entry.txt'));
    assert.deepEqual(readFileSync(join(dir, 'entry.txt')), expected);
  } finally {
    if (previous === undefined) delete process.env.OUTPUT_DIR;
    else process.env.OUTPUT_DIR = previous;
  }
});

test('two clean-cwd CLI runs produce identical bytes without stdout', () => {
  const cwd = join(runRoot, 'empty cwd');
  mkdirSync(cwd);
  const hashes = ['first', 'second'].map((name) => {
    const dir = join(runRoot, name);
    const result = execute(dir, [], cwd);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    const bytes = readFileSync(join(dir, 'entry.txt'));
    assert.deepEqual(bytes, expected);
    return digest(bytes);
  });
  assert.equal(hashes[0], hashes[1]);
  assert.deepEqual(readdirSync(cwd), []);
});

test('entrypoint works with restricted filesystem permissions', () => {
  const dir = join(runRoot, 'restricted');
  const result = execute(dir, [
    '--permission', `--allow-fs-read=${root}`, `--allow-fs-write=${runRoot}`,
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readFileSync(join(dir, 'entry.txt')), expected);
});

test('importing the module has no output side effect', () => {
  const dir = join(runRoot, 'import-only');
  const result = spawnSync(process.execPath, [
    '--experimental-strip-types', '--input-type=module', '-e',
    `await import(${JSON.stringify(new URL('./main.ts', import.meta.url).href)})`,
  ], { env: { ...process.env, OUTPUT_DIR: dir }, encoding: 'utf8', timeout: 5000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(dir), false);
});

test('a file in place of the output directory fails without overwriting it', () => {
  const target = join(runRoot, 'not-a-directory');
  writeFileSync(target, 'keep this');
  const result = execute(target);
  assert.notEqual(result.status, 0);
  assert.equal(readFileSync(target, 'utf8'), 'keep this');
});
