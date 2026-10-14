const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function separateAndTrace() {
  const inputPath = path.resolve(__dirname, '../public/images/Logo.png');
  const metadata = await sharp(inputPath).metadata();
  console.log('Original size:', metadata.width, metadata.height);

  // Use high resolution for crisp SVG curves
  const targetWidth = 2400;
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth);
  
  const { data, info } = await sharp(inputPath)
    .resize(targetWidth, targetHeight)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  console.log('Processing at:', w, h);

  // 1. Red layer: Ribbon, "MD", Box body
  // 2. Teal layer: Lid, ".com"
  // 3. Dark text: "Customized Gift Centre"
  const redBuf = Buffer.alloc(w * h);
  const tealBuf = Buffer.alloc(w * h);
  const darkBuf = Buffer.alloc(w * h);

  // Initialize with 255 (white)
  redBuf.fill(255);
  tealBuf.fill(255);
  darkBuf.fill(255);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const r = data[idx * 3];
      const g = data[idx * 3 + 1];
      const b = data[idx * 3 + 2];

      const isBackground = r > 240 && g > 240 && b > 240;
      if (isBackground) continue;

      // Dark text "Customized Gift Centre" is at the bottom right
      // y > 0.8 * h and x > 0.4 * w, low saturation / near black
      if (y > 0.8 * h && x > 0.4 * w && r < 120 && g < 120 && b < 120 && Math.abs(r - g) < 25) {
        darkBuf[idx] = 0; // Black = foreground for potrace
        continue;
      }

      // Red: r dominant
      if (r > 130 && g < 100 && b < 100) {
        redBuf[idx] = 0;
        continue;
      }

      // Teal / Cyan: g > 80, b > 80, r < 60
      if (r < 70 && g > 75 && b > 75) {
        tealBuf[idx] = 0;
        continue;
      }
    }
  }

  const redPng = await sharp(redBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const tealPng = await sharp(tealBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const darkPng = await sharp(darkBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();

  const tracePromise = (buf, color) => new Promise((resolve, reject) => {
    potrace.trace(buf, {
      color: color,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      turdSize: 4,
      optTolerance: 0.2,
      blackOnWhite: true
    }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });

  console.log('Tracing layers with potrace...');
  const [redSvg, tealSvg, darkSvg] = await Promise.all([
    tracePromise(redPng, '#EC0B12'),
    tracePromise(tealPng, '#0194A3'),
    tracePromise(darkPng, '#1A1A1A')
  ]);

  const extractPath = (svg) => {
    const match = svg.match(/<path[^>]*d="([^"]+)"/);
    return match ? match[1] : '';
  };

  const redPath = extractPath(redSvg);
  const tealPath = extractPath(tealSvg);
  const darkPath = extractPath(darkSvg);

  const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <path d="${redPath}" fill="#EC0B12" fill-rule="evenodd" />
  <path d="${tealPath}" fill="#0194A3" fill-rule="evenodd" />
  <path d="${darkPath}" fill="#1A1A1A" fill-rule="evenodd" />
</svg>`;

  const outPath = path.resolve(__dirname, '../public/images/mdgifts-logo.svg');
  fs.writeFileSync(outPath, combinedSvg.trim());
  console.log('Successfully saved to', outPath, 'Length:', combinedSvg.length);
}

separateAndTrace().catch(console.error);
