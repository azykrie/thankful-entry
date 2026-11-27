import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ENTRY_TEXT, validateEntryText, writeEntry } from './main.ts';

const root = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(root, '.test-output');
mkdirSync(outputRoot, { recursive: true });
const runRoot = mkdtempSync(join(outputRoot, 'run-'));
const entrypoint = join(root, 'main.ts');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('the chosen entry passes its code-point and non-whitespace gate', () => {
  assert.doesNotThrow(() => validateEntryText(ENTRY_TEXT));
  assert.ok(Array.from(ENTRY_TEXT).length <= 1000);
  assert.match(ENTRY_TEXT, /^Thank you for reading/);
});

test('one code point is accepted', () => validateEntryText('x'));
test('exactly 1000 ASCII code points are accepted', () => validateEntryText('x'.repeat(1000)));
test('1001 ASCII code points are rejected', () => assert.throws(() => validateEntryText('x'.repeat(1001))));
test('empty text is rejected', () => assert.throws(() => validateEntryText('')));
test('Unicode whitespace-only text is rejected', () => assert.throws(() => validateEntryText(' \t\r\n\u2003\u00a0')));
test('1000 astral characters count as code points, not UTF-16 units', () => validateEntryText('\u{1F33F}'.repeat(1000)));
test('1001 astral characters are rejected', () => assert.throws(() => validateEntryText('\u{1F33F}'.repeat(1001))));
test('combining marks count separately', () => {
  validateEntryText('e\u0301'.repeat(500));
  assert.throws(() => validateEntryText('e\u0301'.repeat(501)));
});
test('unpaired high surrogates are rejected before UTF-8 encoding', () => assert.throws(() => validateEntryText('\ud800')));
test('unpaired low surrogates are rejected before UTF-8 encoding', () => assert.throws(() => validateEntryText('\udc00')));

test('creates nested output directories and writes exact strict UTF-8 bytes', () => {
  const file = writeEntry(join(runRoot, 'nested', 'folder with spaces', '\u6cb3'));
  assert.equal(file, join(runRoot, 'nested', 'folder with spaces', '\u6cb3', 'entry.txt'));
  const bytes = readFileSync(file);
  assert.equal(new TextDecoder('utf-8', { fatal: true }).decode(bytes), ENTRY_TEXT);
  assert.deepEqual(bytes, Buffer.from(ENTRY_TEXT, 'utf8'));
  assert.ok(!bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])));
});

test('repeated writes overwrite an older longer artifact completely', () => {
  const dir = join(runRoot, 'overwrite');
  mkdirSync(dir);
  writeFileSync(join(dir, 'entry.txt'), 'old text'.repeat(1000));
  writeEntry(dir);
  writeEntry(dir);
  assert.deepEqual(readFileSync(join(dir, 'entry.txt')), Buffer.from(ENTRY_TEXT));
});

test('two independent executions from an empty working directory are byte-identical', () => {
  const cwd = join(runRoot, 'empty working directory');
  mkdirSync(cwd);
  const outputs = ['first', 'second'].map((name) => {
    const output = join(runRoot, name);
    const result = spawnSync(process.execPath, ['--experimental-strip-types', entrypoint], {
      cwd,
      env: { ...process.env, OUTPUT_DIR: output },
      encoding: 'utf8',
      timeout: 5000,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    return readFileSync(join(output, 'entry.txt'));
  });
  assert.deepEqual(outputs[0], Buffer.from(ENTRY_TEXT));
  assert.equal(hash(outputs[0]), hash(outputs[1]));
});

test('production execution succeeds with restricted Node file permissions', () => {
  const output = join(runRoot, 'restricted');
  const result = spawnSync(process.execPath, [
    '--permission',
    `--allow-fs-read=${root}`,
    `--allow-fs-write=${runRoot}`,
    '--experimental-strip-types',
    entrypoint,
  ], { cwd: root, env: { ...process.env, OUTPUT_DIR: output }, encoding: 'utf8', timeout: 5000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readFileSync(join(output, 'entry.txt')), Buffer.from(ENTRY_TEXT));
});

test('an invalid output directory fails visibly', () => {
  const target = join(runRoot, 'is-a-file');
  writeFileSync(target, 'existing file');
  const result = spawnSync(process.execPath, ['--experimental-strip-types', entrypoint], {
    cwd: root, env: { ...process.env, OUTPUT_DIR: target }, encoding: 'utf8', timeout: 5000,
  });
  assert.ifError(result.error);
  assert.notEqual(result.status, 0);
  assert.equal(existsSync(join(target, 'entry.txt')), false);
});

test('all six source candidates satisfy the same text gate', () => {
  const candidates = JSON.parse(readFileSync(join(root, 'review', 'candidates.json'), 'utf8'));
  assert.equal(candidates.length, 6);
  assert.equal(new Set(candidates.map((item) => item.id)).size, 6);
  for (const candidate of candidates) validateEntryText(candidate.text);
});
