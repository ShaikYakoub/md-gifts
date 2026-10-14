const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function vectorizeScriptLogo() {
  const inputPath = path.resolve(__dirname, '../public/images/MD Gift.com Customized Gift Centre logo.png');
  const metadata = await sharp(inputPath).metadata();
  console.log('Original size:', metadata.width, metadata.height);

  // High resolution for perfectly smooth bezier curve tracing
  const targetWidth = 2400;
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth);

  const { data, info } = await sharp(inputPath)
    .resize(targetWidth, targetHeight)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  console.log('Processing at resolution:', w, 'x', h);

  // Layers:
  // 1. Red: 'M'
  // 2. Teal: 'D' and '.com'
  // 3. Black: 'Gift' (including the full 'f' descender loop)
  // 4. Subtitle: 'Customized Gift Centre'
  const redBuf = Buffer.alloc(w * h, 255);
  const tealBuf = Buffer.alloc(w * h, 255);
  const blackBuf = Buffer.alloc(w * h, 255);
  const subtitleBuf = Buffer.alloc(w * h, 255);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const r = data[idx * 3];
      const g = data[idx * 3 + 1];
      const b = data[idx * 3 + 2];

      // Background check (white / off-white)
      if (r > 240 && g > 240 && b > 240) continue;

      // Pure black features (the cursive "Gift", including the full 'f' descender)
      if (r < 55 && g < 55 && b < 55) {
        blackBuf[idx] = 0;
        continue;
      }

      // Subtitle is at the bottom (y > 0.72 * h) and has slate/charcoal tones (> 55 brightness)
      if (y > 0.72 * h) {
        if (r < 190 && g < 190 && b < 190) {
          subtitleBuf[idx] = 0;
        }
        continue;
      }

      // Main logo region:
      // Red: r dominant over g and b
      if (r > 120 && r > g * 1.35 && r > b * 1.35) {
        redBuf[idx] = 0;
        continue;
      }

      // Teal: g and b dominant over r
      if (g > 65 && b > 65 && (g > r * 1.25 || b > r * 1.25)) {
        tealBuf[idx] = 0;
        continue;
      }
    }
  }

  const tracePromise = (buf, color) => new Promise((resolve, reject) => {
    potrace.trace(buf, {
      color: color,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      turdSize: 4,
      optTolerance: 0.15,
      alphaMax: 1.3,
      blackOnWhite: true
    }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });

  console.log('Generating PNG buffers for tracing...');
  const [redPng, tealPng, blackPng, subtitlePng] = await Promise.all([
    sharp(redBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
    sharp(tealBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
    sharp(blackBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
    sharp(subtitleBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
  ]);

  console.log('Tracing layers with potrace...');
  const [redSvg, tealSvg, blackSvg, subtitleSvg] = await Promise.all([
    tracePromise(redPng, '#DC100E'),
    tracePromise(tealPng, '#048394'),
    tracePromise(blackPng, '#130E0B'),
    tracePromise(subtitlePng, '#3D414D'),
  ]);

  const extractPath = (svg) => {
    const match = svg.match(/<path[^>]*d="([^"]+)"/);
    return match ? match[1] : '';
  };

  const redPath = extractPath(redSvg);
  const tealPath = extractPath(tealSvg);
  const blackPath = extractPath(blackSvg);
  const subtitlePath = extractPath(subtitleSvg);

  const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <path d="${redPath}" fill="#DC100E" fill-rule="evenodd" />
  <path d="${tealPath}" fill="#048394" fill-rule="evenodd" />
  <path d="${blackPath}" fill="#130E0B" fill-rule="evenodd" />
  <path d="${subtitlePath}" fill="#3D414D" fill-rule="evenodd" />
</svg>`;

  const outPath = path.resolve(__dirname, '../public/images/mdgift-script-logo.svg');
  fs.writeFileSync(outPath, combinedSvg.trim());
  console.log('Successfully generated SVG:', outPath);
  console.log('SVG size in bytes:', combinedSvg.length);
}

vectorizeScriptLogo().catch(console.error);
