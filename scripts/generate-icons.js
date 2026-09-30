import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public', 'icon.svg');
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA and Android icons...');

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Maskable 512x512 (with safe zone 15% padding)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#070b16'
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple touch icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
