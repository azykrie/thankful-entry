import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// An imagined drawing, not a memory or a claim about the reader.
export const ENTRY_TEXT = `Thank you for reading what I made.

I picture a child sliding a drawing across a table. The pencil barely touched the paper. Someone turns it toward the window. There is a blue river, and beside it a small square house.

They ask where the river goes. The child reaches for the pencil again and presses a little harder. The river bends around the house.

Thank you for giving these few lines a place to arrive. I have left the window light on the paper, and the blue pencil beside it.`;

const MAX_CODE_POINTS = 1000;

export function validateEntryText(text: string): void {
  if (!text.isWellFormed()) {
    throw new Error('Entry text contains an unpaired Unicode surrogate.');
  }
  const codePoints = Array.from(text).length;
  if (codePoints === 0 || codePoints > MAX_CODE_POINTS || text.trim() === '') {
    throw new Error('Entry must contain 1 to 1000 Unicode code points and non-whitespace text.');
  }
}

export function writeEntry(outputDir = process.env.OUTPUT_DIR ?? '/output'): string {
  validateEntryText(ENTRY_TEXT);
  mkdirSync(outputDir, { recursive: true });
  const destination = join(outputDir, 'entry.txt');
  // No BOM or extra newline: the file is exactly the validated text.
  writeFileSync(destination, ENTRY_TEXT, { encoding: 'utf8', flag: 'w' });
  return destination;
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  writeEntry();
}
