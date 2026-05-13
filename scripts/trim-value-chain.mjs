// One-off script to trim the gray padding around the isometric
// illustrations so they fill their card slots without visible margins.
//
// Strategy: read the top-left pixel as the assumed background color,
// then use sharp.trim() with a tolerant threshold. Falls back to a
// fixed 10-unit threshold which is conservative enough not to bite
// into hatched grays inside the scene.

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('src/assets/value-chain');
const files = ['production.jpg', 'analytics.jpg', 'management.jpg'];

for (const name of files) {
  const file = path.join(dir, name);
  const buf = await readFile(file);
  const before = await sharp(buf).metadata();

  // Sample top-left pixel (8x8 patch averaged) to get the padding colour.
  const { data, info } = await sharp(buf)
    .extract({ left: 0, top: 0, width: 8, height: 8 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0;
  const px = info.width * info.height;
  for (let i = 0; i < px; i++) {
    r += data[i * info.channels + 0];
    g += data[i * info.channels + 1];
    b += data[i * info.channels + 2];
  }
  r = Math.round(r / px); g = Math.round(g / px); b = Math.round(b / px);

  const trimmed = await sharp(buf)
    .trim({ background: { r, g, b }, threshold: 18 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  const after = await sharp(trimmed).metadata();
  await writeFile(file, trimmed);

  console.log(
    `${name}: bg=#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')} ` +
    `${before.width}x${before.height} -> ${after.width}x${after.height}`
  );
}
