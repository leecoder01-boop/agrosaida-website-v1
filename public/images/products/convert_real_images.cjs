const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const PRODUCTS_DIR = __dirname;

// Mapeamento dos 18 anexos por categoria
const IMAGES = [
  { index: 0, name: 'racao-1.webp', category: 'Rações' },
  { index: 1, name: 'racao-2.webp', category: 'Rações' },
  { index: 2, name: 'racao-3.webp', category: 'Rações' },
  { index: 3, name: 'remedio-1.webp', category: 'Medicamentos' },
  { index: 4, name: 'remedio-2.webp', category: 'Medicamentos' },
  { index: 5, name: 'chapeu-1.webp', category: 'Botas & Chapéus' },
  { index: 6, name: 'bota-1.webp', category: 'Botas & Chapéus' },
  { index: 7, name: 'faca-1.webp', category: 'Ferramentas' },
  { index: 8, name: 'faca-2.webp', category: 'Ferramentas' },
  // Continue mapping remaining 9 attachments as needed
];

// Caminho do temp de anexos do Claude Desktop
const ATTACHMENTS_BASE = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Temp', 'claude', 'C--Users-cleit');

async function convertAttachments() {
  for (const img of IMAGES) {
    // Try to find the attachment file
    const srcPatterns = [
      path.join(ATTACHMENTS_BASE, `*.${img.index}.*`),
      path.join(ATTACHMENTS_BASE, `${img.index}.*`),
      path.join(ATTACHMENTS_BASE, `image-${img.index}.*`),
    ];

    let srcFile = null;
    for (const pattern of srcPatterns) {
      try {
        const files = fs.readdirSync(ATTACHMENTS_BASE);
        const match = files.find(f => f.includes(String(img.index)) || f.match(new RegExp(`image.*${img.index}|${img.index}.*image`, 'i')));
        if (match) {
          srcFile = path.join(ATTACHMENTS_BASE, match);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!srcFile) {
      console.log(`[skip] index ${img.index} não encontrado`);
      continue;
    }

    const dest = path.join(PRODUCTS_DIR, img.name);
    try {
      execSync(`ffmpeg -y -i "${srcFile}" -qscale:v 80 "${dest}"`, { stdio: 'ignore' });
      console.log(`[ok] ${img.name} (${img.category})`);
    } catch (e) {
      console.log(`[erro] ${img.name}:`, e.message);
    }
  }

  console.log('\nArquivos em products:');
  try {
    const files = fs.readdirSync(PRODUCTS_DIR);
    files.forEach(f => console.log(f));
  } catch (e) {
    console.log('erro ao listar:', e.message);
  }
}

convertAttachments();