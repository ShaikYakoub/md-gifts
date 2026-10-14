const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function vectorizeTechmecs() {
  const inputPath = 'C:/Users/Windows/.gemini/antigravity-ide/brain/faac57b3-84f1-4f52-ab01-5cbdc361f68b/.user_uploaded/media_1791969836774.png';
  
  // Upscale for smooth bezier curves
  const scale = 4;
  const { data, info } = await sharp(inputPath)
    .resize(433 * scale, 85 * scale, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // Let's create buffers for:
  // 1. "Website by" (grey)
  // 2. "tech" (white/neutral)
  // 3. "m" (red)
  // 4. "e" (blue)
  // 5. "c" (yellow)
  // 6. "s" (green)
  // 7. "®" (registered trademark)
  const websiteBuf = Buffer.alloc(w * h).fill(255);
  const techBuf = Buffer.alloc(w * h).fill(255);
  const mBuf = Buffer.alloc(w * h).fill(255);
  const eBuf = Buffer.alloc(w * h).fill(255);
  const cBuf = Buffer.alloc(w * h).fill(255);
  const sBuf = Buffer.alloc(w * h).fill(255);
  const regBuf = Buffer.alloc(w * h).fill(255);

  // Also a single buffer for all of techmecs together
  const allTechmecsBuf = Buffer.alloc(w * h).fill(255);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const r = data[idx * 4];
      const g = data[idx * 4 + 1];
      const b = data[idx * 4 + 2];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness < 45) continue; // background

      const origX = x / scale;

      // "Website by" is approximately x: 0 to 185
      if (origX < 190) {
        websiteBuf[idx] = 0;
        continue;
      }

      // Beyond 190 is "techmecs®"
      allTechmecsBuf[idx] = 0;

      // Registered symbol ® is around x > 385 and y < 35 (orig)
      if (origX > 380 && (y / scale) < 36) {
        regBuf[idx] = 0;
        continue;
      }

      // Red 'm': r > 120, g < 60, b < 60
      if (r > 120 && g < 80 && b < 80) {
        mBuf[idx] = 0;
        continue;
      }

      // Blue 'e': b > 120, r < 80
      if (b > 120 && r < 80) {
        eBuf[idx] = 0;
        continue;
      }

      // Yellow 'c': r > 120, g > 100, b < 60
      if (r > 130 && g > 100 && b < 60) {
        cBuf[idx] = 0;
        continue;
      }

      // Green 's': g > 100, r < 70, b < 70
      if (g > 90 && r < 70 && b < 70) {
        sBuf[idx] = 0;
        continue;
      }

      // Otherwise 'tech'
      if (origX >= 190 && origX < 285) {
        techBuf[idx] = 0;
        continue;
      }
    }
  }

  const tracePromise = (buf) => new Promise((resolve, reject) => {
    potrace.trace(buf, {
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      turdSize: 3,
      optTolerance: 0.15,
      blackOnWhite: true
    }, (err, svg) => {
      if (err) reject(err);
      else {
        const match = svg.match(/<path[^>]*d="([^"]+)"/);
        resolve(match ? match[1] : '');
      }
    });
  });

  const [websitePath, techPath, mPath, ePath, cPath, sPath, regPath] = await Promise.all([
    tracePromise(await sharp(websiteBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(techBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(mBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(eBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(cBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(sBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer()),
    tracePromise(await sharp(regBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer())
  ]);

  const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <!-- Website by -->
  <path d="${websitePath}" fill="currentColor" fill-rule="evenodd" opacity="0.75" />
  <!-- tech -->
  <path d="${techPath}" fill="currentColor" fill-rule="evenodd" />
  <!-- m (red) -->
  <path d="${mPath}" fill="#EA4335" fill-rule="evenodd" />
  <!-- e (blue) -->
  <path d="${ePath}" fill="#4285F4" fill-rule="evenodd" />
  <!-- c (yellow) -->
  <path d="${cPath}" fill="#FBBC05" fill-rule="evenodd" />
  <!-- s (green) -->
  <path d="${sPath}" fill="#34A853" fill-rule="evenodd" />
  <!-- ® -->
  <path d="${regPath}" fill="currentColor" fill-rule="evenodd" opacity="0.75" />
</svg>`;

  fs.writeFileSync('public/images/techmecs-logo.svg', combinedSvg.trim());
  console.log('Saved public/images/techmecs-logo.svg!');

  // Generate a preview png on white and on dark background
  const previewLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
    <rect width="${w}" height="${h}" fill="#FAF4F0"/>
    <g color="#221C1D">
      ${combinedSvg.replace('<svg xmlns="http://www.w3.org/2000/svg"', '<g').replace('</svg>', '</g>')}
    </g>
  </svg>`;
  await sharp(Buffer.from(previewLight)).png().toFile('public/images/techmecs-preview-light.png');
  console.log('Generated techmecs-preview-light.png');
}

vectorizeTechmecs().catch(console.error);
