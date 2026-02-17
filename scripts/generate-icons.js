// Run after deploy: node scripts/generate-icons.js
// Downloads the generated icon from the deployed app and saves as PNG
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://cup-shuffle-game.vercel.app';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'public', 'images');
  console.log('Downloading icon from', `${BASE_URL}/icon-gen`);
  await download(`${BASE_URL}/icon-gen`, path.join(publicDir, 'icon.png'));
  console.log('Saved icon.png');

  console.log('Downloading splash from', `${BASE_URL}/api/og`);
  await download(`${BASE_URL}/api/og`, path.join(publicDir, 'splash.png'));
  console.log('Saved splash.png');
}

main().catch(console.error);
