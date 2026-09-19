const fs = require('fs');
const path = require('path');
process.chdir(__dirname);

const bag = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
    <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="428" rx="200" ry="30" fill="#000" opacity="0.4"/>
  <path d="M220 150 L420 150 L432 420 L208 420 Z" fill="url(#prod)"/>
  <path d="M262 100 h16 v50 h-16 Z M362 100 h16 v50 h-16 Z" fill="${c2}"/>
  <rect x="252" y="108" width="136" height="36" rx="6" fill="${c1}" opacity="0.9"/>
  <text x="320" y="131" font-family="Georgia, serif" font-size="15" fill="#f2ead6" text-anchor="middle" letter-spacing="2">${label}</text>
  <rect x="244" y="212" width="152" height="120" rx="8" fill="#f2ead6" opacity="0.92"/>
  <rect x="260" y="232" width="120" height="8" fill="${c2}"/>
  <rect x="260" y="250" width="120" height="8" fill="${c2}" opacity="0.7"/>
  <rect x="260" y="268" width="90" height="8" fill="${c2}" opacity="0.5"/>
  <circle cx="320" cy="302" r="18" fill="${c1}"/>
</svg>`;

const sack = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="428" rx="210" ry="32" fill="#000" opacity="0.4"/>
  <path d="M210 190 Q320 165 430 190 L448 420 Q320 445 192 420 Z" fill="${c2}"/>
  <path d="M212 190 Q320 240 428 190" fill="none" stroke="${c1}" stroke-width="6"/>
  <path d="M254 130 h20 v62 h-20 Z M366 130 h20 v62 h-20 Z" fill="${c2}"/>
  <text x="320" y="320" font-family="Georgia, serif" font-size="30" fill="#f2ead6" text-anchor="middle" letter-spacing="4">${label}</text>
  <path d="M240 350 h160" stroke="#f2ead6" stroke-width="2" opacity="0.6"/>
  <text x="320" y="378" font-family="Georgia, serif" font-size="13" fill="#f2ead6" text-anchor="middle" letter-spacing="3">AGROSAIDA</text>
</svg>`;

const tool = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#dfe4d8"/>
      <stop offset="0.5" stop-color="#9aa694"/>
      <stop offset="1" stop-color="#dfe4d8"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="428" rx="210" ry="30" fill="#000" opacity="0.4"/>
  <rect x="150" y="230" width="340" height="16" rx="8" fill="${c2}" transform="rotate(-24 320 300)"/>
  <path d="M432 160 l52 30 l-44 92 l-54 -28 Z" fill="url(#steel)"/>
  <rect x="140" y="350" width="360" height="30" rx="15" fill="${c1}" opacity="0.9"/>
  <text x="320" y="372" font-family="Georgia, serif" font-size="15" fill="#0c1a10" text-anchor="middle" letter-spacing="3">${label}</text>
</svg>`;

const med = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="428" rx="180" ry="28" fill="#000" opacity="0.4"/>
  <rect x="250" y="150" width="140" height="260" rx="18" fill="${c2}"/>
  <rect x="250" y="150" width="140" height="80" rx="18" fill="${c1}"/>
  <rect x="284" y="118" width="72" height="40" rx="8" fill="${c1}"/>
  <text x="320" y="200" font-family="Georgia, serif" font-size="17" fill="#0c1a10" text-anchor="middle" letter-spacing="2">${label}</text>
  <rect x="278" y="262" width="84" height="10" rx="5" fill="#f2ead6" opacity="0.8"/>
  <rect x="278" y="282" width="84" height="10" rx="5" fill="#f2ead6" opacity="0.6"/>
  <rect x="278" y="302" width="56" height="10" rx="5" fill="#f2ead6" opacity="0.4"/>
</svg>`;

const boot = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="428" rx="200" ry="30" fill="#000" opacity="0.4"/>
  <path d="M250 110 L310 110 L318 330 L382 330 L382 396 L250 396 Z" fill="${c2}"/>
  <path d="M250 110 h60 l8 40 h-68 Z" fill="${c1}"/>
  <path d="M250 380 h132 v16 h-132 Z" fill="#1c1c1c"/>
  <rect x="244" y="352" width="144" height="14" rx="7" fill="${c1}" opacity="0.85"/>
  <text x="320" y="440" font-family="Georgia, serif" font-size="14" fill="#b9c7a8" text-anchor="middle" letter-spacing="3">${label}</text>
</svg>`;

const hat = (c1, c2, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16241a"/>
      <stop offset="1" stop-color="#0c1a10"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  <ellipse cx="320" cy="410" rx="220" ry="26" fill="#000" opacity="0.4"/>
  <ellipse cx="320" cy="330" rx="215" ry="52" fill="${c2}"/>
  <ellipse cx="320" cy="322" rx="215" ry="48" fill="${c1}"/>
  <path d="M258 320 Q320 140 382 320 Z" fill="${c2}"/>
  <path d="M268 318 Q320 158 372 318 Z" fill="${c1}"/>
  <rect x="256" y="298" width="128" height="20" rx="10" fill="#0c1a10"/>
  <rect x="256" y="298" width="128" height="20" rx="10" fill="${c1}" opacity="0.3"/>
  <text x="320" y="446" font-family="Georgia, serif" font-size="14" fill="#b9c7a8" text-anchor="middle" letter-spacing="3">${label}</text>
</svg>`;

const products = {
  'cat-racao-1': [sack, '#8a9a5b', '#5b6b3a', 'BOVINOS'],
  'cat-racao-2': [sack, '#a3c77a', '#4a7c38', 'EQUINA'],
  'cat-racao-3': [bag, '#c9a86a', '#8a6f3d', 'CAES'],
  'cat-racao-4': [sack, '#d5c58a', '#9a8b52', 'AVES'],
  'cat-ferr-1': [tool, '#8a9a5b', '#3d4d2e', 'PULVERIZADOR'],
  'cat-ferr-2': [tool, '#a3c77a', '#4a5a30', 'ENXADA'],
  'cat-ferr-3': [tool, '#d5a85a', '#6e5626', 'ALICATE'],
  'cat-med-1': [med, '#a3c77a', '#2e4d2e', 'VERMIFUGO'],
  'cat-med-2': [med, '#d5a85a', '#4d3d1e', 'EQUINOS'],
  'cat-ins-1': [bag, '#8a9a5b', '#4a5a30', 'SEMENTE'],
  'cat-ins-2': [sack, '#7a6b4d', '#4d4232', 'ADUBO'],
  'cat-ins-3': [bag, '#d5a85a', '#8a6f3d', 'SAL MINERAL'],
  'cat-ins-4': [sack, '#a3c77a', '#5b6b3a', 'SUPLEMENTO'],
  'cat-bota-1': [boot, '#7a5c3a', '#4d3a22', 'BOTINA'],
  'cat-chapeu-1': [hat, '#d9c48a', '#a8935b', 'CHAPEU'],
};

for (const [name, [fn, c1, c2, label]] of Object.entries(products)) {
  fs.writeFileSync(`${name}.svg`, fn(c1, c2, label));
  console.log(`created ${name}.svg`);
}