const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const PUBLIC = path.join(__dirname, '..', 'public')
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true })

const svg512 = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00A859"/><stop offset="100%" stop-color="#007A3E"/></linearGradient></defs>
  <rect width="512" height="512" rx="80" fill="url(#g)"/>
  <text x="256" y="280" font-family="system-ui,-apple-system,sans-serif" font-size="280" font-weight="800" fill="white" text-anchor="middle">M</text>
  <text x="256" y="390" font-family="system-ui,-apple-system,sans-serif" font-size="60" font-weight="600" fill="rgba(255,255,255,0.8)" text-anchor="middle">Moov'</text>
</svg>`

async function main() {
  await sharp(Buffer.from(svg512)).resize(192, 192).png().toFile(path.join(PUBLIC, 'pwa-192x192.png'))
  await sharp(Buffer.from(svg512)).resize(512, 512).png().toFile(path.join(PUBLIC, 'pwa-512x512.png'))
  const svg32 = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#00A859"/>
    <text x="16" y="20" font-family="system-ui,sans-serif" font-size="20" font-weight="800" fill="white" text-anchor="middle">M</text>
  </svg>`
  fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), svg32)
  console.log('OK: icons generated in public/')
}

main().catch(console.error)
