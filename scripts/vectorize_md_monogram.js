const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function traceMD() {
  const input = path.resolve(__dirname, '../public/images/MD Gift.com Customized Gift Centre logo.png');
  
  // Crop the MD region with 20px padding
  // minX: 24, maxX: 784, minY: 152, maxY: 533
  const cropLeft = Math.max(0, 24 - 15);
  const cropTop = Math.max(0, 152 - 15);
  const cropWidth = 784 - 24 + 30;
  const cropHeight = 533 - 152 + 30;
  
  // Scale up for high-resolution vector tracing
  const targetW = 1600;
  const targetH = Math.round((cropHeight / cropWidth) * targetW);
  
  const { data, info } = await sharp(input)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(targetW, targetH)
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const w = info.width;
  const h = info.height;
  const redBuf = Buffer.alloc(w * h, 255);
  const tealBuf = Buffer.alloc(w * h, 255);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const r = data[idx * 3];
      const g = data[idx * 3 + 1];
      const b = data[idx * 3 + 2];
      if (r > 240 && g > 240 && b > 240) continue;
      
      // Red M
      if (r > 120 && r > g * 1.35 && r > b * 1.35) {
        redBuf[idx] = 0;
        continue;
      }
      
      // Teal D
      if (g > 65 && b > 65 && (g > r * 1.25 || b > r * 1.25)) {
        tealBuf[idx] = 0;
        continue;
      }
    }
  }
  
  const trace = (buf, color) => new Promise((resolve, reject) => {
    potrace.trace(buf, {
      color,
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
  
  const [redPng, tealPng] = await Promise.all([
    sharp(redBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
    sharp(tealBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer(),
  ]);
  
  const [redSvg, tealSvg] = await Promise.all([
    trace(redPng, '#DC100E'),
    trace(tealPng, '#048394'),
  ]);
  
  const extract = (s) => {
    const match = s.match(/<path[^>]*d="([^"]+)"/);
    return match ? match[1] : '';
  };
  const redD = extract(redSvg);
  const tealD = extract(tealSvg);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <path d="${redD}" fill="#DC100E" fill-rule="evenodd" />
  <path d="${tealD}" fill="#048394" fill-rule="evenodd" />
</svg>`;
    
  const outPath = path.resolve(__dirname, '../public/images/md-monogram.svg');
  fs.writeFileSync(outPath, svg.trim());
  console.log('Saved public/images/md-monogram.svg, size:', svg.length);
}

traceMD().catch(console.error);
