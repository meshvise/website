// One-off : convert "eshvise" to SVG path data using Inter Semibold
// (latin subset, weight 600) shipped by @fontsource. Output is meant to
// be pasted into brand/wordmark.svg and src/components/Wordmark.astro
// replacing the <text> element. With paths, the wordmark renders identical
// standalone and inline, no font-loading variance.

import opentype from 'opentype.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const fontPath = path.resolve('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff');
const font = opentype.parse(readFileSync(fontPath).buffer);

const text = 'eshvise';
const fontSize = 500;
const baselineX = 950;
const baselineY = 880;
const letterSpacing = -20;

// Build the path by walking each glyph manually; the high-level
// font.getPath blows up on a CCMP substitution table opentype.js does
// not implement, but glyph-by-glyph stays in the supported subset.
const scale = fontSize / font.unitsPerEm;
let x = baselineX;
const merged = new opentype.Path();
for (const ch of text) {
  const glyph = font.charToGlyph(ch);
  const glyphPath = glyph.getPath(x, baselineY, fontSize);
  for (const cmd of glyphPath.commands) merged.commands.push(cmd);
  x += glyph.advanceWidth * scale + letterSpacing;
}

const d = merged.toPathData(2);
const bbox = merged.getBoundingBox();

console.log('path d:');
console.log(d);
console.log('');
console.log('bbox:', bbox);
console.log('right edge x:', bbox.x2.toFixed(1));
console.log('width:', (bbox.x2 - bbox.x1).toFixed(1));
