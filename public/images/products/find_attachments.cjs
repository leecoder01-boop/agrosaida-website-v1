const fs = require('fs');
const TR = 'C:/Users/cleit/.claude/projects/C--Users-cleit/e8568dac-c0cd-4f89-9ef8-2512b82d1703.jsonl';
const lines = fs.readFileSync(TR, 'utf8').split('\n');
const found = new Set();
const reAll = /(?:[A-Za-z]:[\\/][^"]{0,220}?|\/c\/Users\/[^"]{0,220}?)\.(?:jpg|jpeg|png|webp|heic|JPG|JPEG|PNG|HEIC)/g;
const re2 = /"(?:fileId|file_id|filename|fileName)":\s*"[^"]{0,300}"/g;
for (const l of lines) {
  if (!/image|photo|attach/i.test(l)) continue;
  let m;
  while ((m = reAll.exec(l))) found.add(m[0]);
  while ((m = re2.exec(l))) if (/(image|photo|jpg|jpeg|png|heic|webp)/i.test(m[0])) found.add(m[0]);
}
console.log([...found].join('\n') || '(nada)');
console.log('---total', found.size);
