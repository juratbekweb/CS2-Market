import fs from 'fs';
import path from 'path';
const root = path.resolve('src/data');
const data = fs.readFileSync(path.join(root, 'products.js'), 'utf8');
const productNames = [...data.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
const localSection = data.match(/const localImages = \{([\s\S]*?)\};/);
const localKeys = new Set();
if (localSection) {
  for (const m of localSection[1].matchAll(/['"]([^'"]+)['"]\s*:/g)) {
    localKeys.add(m[1]);
  }
}
const missing = productNames.filter((n) => !localKeys.has(n));
const files = [];
for (const dir of ['src/images/gloves', 'src/images/knives', 'src/images/weapons']) {
  const p = path.resolve(dir);
  if (fs.existsSync(p)) {
    for (const f of fs.readdirSync(p)) {
      const full = path.join(p, f);
      if (fs.statSync(full).isFile()) {
        files.push({dir, name: f});
      }
    }
  }
}
const norm = (name) => name.toLowerCase().replace(/\|/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
for (const name of missing) {
  const n = norm(name);
  const candidates = files.filter((f) => {
    const fn = norm(f.name);
    return fn.includes(n) || n.includes(fn) || fn.includes(n.split(' ').slice(-1)[0]);
  });
  if (candidates.length) {
    console.log('MISSING:', name);
    for (const c of candidates.slice(0, 5)) {
      console.log('  ', c.dir, c.name);
    }
  }
}
