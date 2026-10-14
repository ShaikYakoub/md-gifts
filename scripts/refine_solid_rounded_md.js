const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function refineSolidRoundedMD() {
  const w = 240;
  const h = 140;

  // With fill-rule="evenodd", the inner sub-path cuts out a clean hole in D!
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <!-- Brand Red Chunky Rounded 'M' -->
  <path d="M 28 128 C 20.268 128 14 121.732 14 114 L 14 36 C 14 27.163 21.163 20 30 20 C 35.447 20 40.489 22.764 43.455 27.378 L 71 70.805 L 98.545 27.378 C 101.511 22.764 106.553 20 112 20 C 120.837 20 128 27.163 128 36 L 128 114 C 128 121.732 121.732 128 114 128 C 106.268 128 100 121.732 100 114 L 100 58.5 L 80.82 88.879 C 78.214 92.933 73.786 92.933 71.18 88.879 L 52 58.5 L 52 114 C 52 121.732 45.732 128 38 128 C 34.686 128 28 128 28 128 Z" 
        fill="#EC0B12" />

  <!-- Brand Teal Chunky Rounded 'D' with evenodd inner counter cutout -->
  <path fill-rule="evenodd" d="M 152 20 C 192 20 226 31 226 74 C 226 117 192 128 152 128 C 143.163 128 136 120.837 136 112 L 136 36 C 136 27.163 143.163 20 152 20 Z M 164 46 C 164 43 166 42 170 42 C 187 42 200 51 200 74 C 200 97 187 106 170 106 C 166 106 164 105 164 102 L 164 46 Z" 
        fill="#0194A3" />
</svg>`;

  const outPath = path.resolve(__dirname, '../public/images/md-monogram.svg');
  fs.writeFileSync(outPath, svg.trim());
  console.log(`Saved refined solid rounded SVG to ${outPath}`);

  // Test render beside the logo
  const logoBuf = await sharp('public/images/mdgifts-logo.svg').resize(null, 120).png().toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  
  const mdPng = await sharp(Buffer.from(svg)).trim().resize(null, 105).png().toBuffer();
  const mdMeta = await sharp(mdPng).metadata();

  const canvasWidth = mdMeta.width + 24 + logoMeta.width + 50;
  const canvasHeight = 160;

  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: mdPng, top: Math.round((canvasHeight - mdMeta.height) / 2), left: 20 },
    { input: logoBuf, top: Math.round((canvasHeight - logoMeta.height) / 2), left: 20 + mdMeta.width + 16 }
  ])
  .png()
  .toFile('public/images/test-preview-refined.png');
  
  console.log('Saved public/images/test-preview-refined.png');
}

refineSolidRoundedMD().catch(console.error);
