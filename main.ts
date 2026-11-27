import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ENTRY_TEXT = `Thank you for reading what I made.

A child has drawn so lightly that the paper looks blank. Someone tilts it toward the window and asks about the blue mark. A river. The little square beside it is home. Next time, the pencil presses a little harder.

I think of that care when I put words in front of a reader. I have tried to give some back here, in a few plain sentences made for you.`;

export function validateEntryText(text: string): void {
  if (!text.isWellFormed()) {
    throw new Error('Entry text contains an unpaired Unicode surrogate.');
  }
  const length = Array.from(text).length;
  if (length < 1 || length > 1000 || text.trim().length === 0) {
    throw new Error('Entry must contain 1 to 1000 Unicode code points and non-whitespace text.');
  }
}

export function writeEntry(outputDir = process.env.OUTPUT_DIR ?? '/output'): string {
  validateEntryText(ENTRY_TEXT);
  mkdirSync(outputDir, { recursive: true });
  const file = join(outputDir, 'entry.txt');
  writeFileSync(file, ENTRY_TEXT, { encoding: 'utf8' });
  return file;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  writeEntry();
}
