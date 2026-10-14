const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function generateMatchingMD() {
  // Render high-res bitmap of MD in Trebuchet MS Bold Italic (the exact font on the logo)
  const width = 1200;
  const height = 650;
  
  // We separate M and D on black on white so potrace traces pure vector outlines
  const svgM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="white" />
  <text x="60" y="520" font-family="Trebuchet MS, sans-serif" font-size="560" font-weight="bold" font-style="italic" letter-spacing="-8">
    <tspan fill="black">M</tspan>
  </text>
</svg>`;

  const svgD = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="white" />
  <text x="60" y="520" font-family="Trebuchet MS, sans-serif" font-size="560" font-weight="bold" font-style="italic" letter-spacing="-8">
    <tspan fill="transparent">M</tspan><tspan fill="black">D</tspan>
  </text>
</svg>`;

  const [pngMBuf, pngDBuf] = await Promise.all([
    sharp(Buffer.from(svgM)).png().toBuffer(),
    sharp(Buffer.from(svgD)).png().toBuffer(),
  ]);

  const trace = (buf) => new Promise((resolve, reject) => {
    potrace.trace(buf, {
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      turdSize: 2,
      optTolerance: 0.1,
      alphaMax: 1.3,
      blackOnWhite: true
    }, (err, svg) => err ? reject(err) : resolve(svg));
  });

  const [svgMResult, svgDResult] = await Promise.all([trace(pngMBuf), trace(pngDBuf)]);

  const extractPath = (s) => (s.match(/<path[^>]*d="([^"]+)"/) || [])[1] || '';
  const pathM = extractPath(svgMResult);
  const pathD = extractPath(svgDResult);

  // Combine into a tight, crisp SVG
  const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none">
  <path d="${pathM}" fill="#EC0B12" fill-rule="evenodd" />
  <path d="${pathD}" fill="#0194A3" fill-rule="evenodd" />
</svg>`;

  // Find tight bounding box of both paths using sharp
  const tempBuf = await sharp(Buffer.from(combinedSvg)).trim().toBuffer({ resolveWithObject: true });
  console.log('Trimmed dimensions:', tempBuf.info.width, 'x', tempBuf.info.height);

  // Re-render trimmed SVG
  const trimmedWidth = tempBuf.info.width;
  const trimmedHeight = tempBuf.info.height;

  // Let's create the final SVG by tracing the trimmed combined image or setting proper viewBox
  const outPath = path.resolve(__dirname, '../public/images/md-monogram.svg');
  
  // High quality trace on trimmed PNG
  const trimmedPng = await sharp(Buffer.from(combinedSvg)).trim().png().toBuffer();
  
  // Separate trimmed M and D
  const { data, info } = await sharp(trimmedPng).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const redBuf = Buffer.alloc(w * h, 255);
  const tealBuf = Buffer.alloc(w * h, 255);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) continue;
      if (r > 150 && g < 50 && b < 50) {
        redBuf[y * w + x] = 0;
      } else if (r < 50 && g > 100 && b > 100) {
        tealBuf[y * w + x] = 0;
      }
    }
  }

  const [redPng, tealPng] = await Promise.all([
    sharp(redBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
    sharp(tealBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
  ]);

  const [tracedRed, tracedTeal] = await Promise.all([trace(redPng), trace(tealPng)]);
  const finalPathM = extractPath(tracedRed);
  const finalPathD = extractPath(tracedTeal);

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <path d="${finalPathM}" fill="#EC0B12" fill-rule="evenodd" />
  <path d="${finalPathD}" fill="#0194A3" fill-rule="evenodd" />
</svg>`;

  fs.writeFileSync(outPath, finalSvg.trim());
  console.log(`Saved tight vector SVG to ${outPath} (${w}x${h}, ${finalSvg.length} bytes)`);
}

generateMatchingMD().catch(console.error);
