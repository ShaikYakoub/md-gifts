const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateSolidRoundedMD() {
  // Ultra-crisp vector SVG for solid rounded "MD"
  // Designed to match the chunky rounded geometry of Gift.com
  const w = 240;
  const h = 140;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <!-- Brand Red Chunky Rounded 'M' matching the gift box -->
  <path d="M 26 130 C 18.268 130 12 123.732 12 116 L 12 34 C 12 25.163 19.163 18 28 18 C 33.447 18 38.489 20.764 41.455 25.378 L 70 69.805 L 98.545 25.378 C 101.511 20.764 106.553 18 112 18 C 120.837 18 128 25.163 128 34 L 128 116 C 128 123.732 121.732 130 114 130 C 106.268 130 100 123.732 100 116 L 100 58.5 L 79.82 89.879 C 77.214 93.933 72.786 93.933 70.18 89.879 L 50 58.5 L 50 116 C 50 123.732 43.732 130 36 130 C 32.686 130 26 130 26 130 Z" 
        fill="#EC0B12" />

  <!-- Brand Teal Chunky Rounded 'D' matching .com and cyan lid -->
  <path d="M 152 18 C 190.66 18 228 29.5 228 74 C 228 118.5 190.66 130 152 130 C 143.163 130 136 122.837 136 114 L 136 34 C 136 25.163 143.163 18 152 18 Z M 164 44 L 164 104 C 184 104 200 97.5 200 74 C 200 50.5 184 44 164 44 Z" 
        fill="#0194A3" />
</svg>`;

  const outPath = path.resolve(__dirname, '../public/images/md-monogram.svg');
  fs.writeFileSync(outPath, svg.trim());
  console.log(`Saved solid rounded SVG to ${outPath}`);

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
  .toFile('public/images/test-preview-solid-rounded.png');
  
  console.log('Saved public/images/test-preview-solid-rounded.png');
}

generateSolidRoundedMD().catch(console.error);
