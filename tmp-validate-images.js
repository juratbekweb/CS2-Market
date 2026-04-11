import fs from 'fs'

const file = './src/data/products.js'
const text = fs.readFileSync(file, 'utf8')

const productMatches = [...text.matchAll(/\{\s*id:\s*\d+,\s*\n([\s\S]*?)\n\s*\}/g)]

const getName = (block) => {
  const m = block.match(/name:\s*['"]([^'"]+)['"]/)
  return m?.[1]
}

const localKeys = new Set()
const localMapSection = text.match(/const localImages = \{([\s\S]*?)\};/)
if (localMapSection) {
  const entries = localMapSection[1].matchAll(/['"]([^'"]+)['"]\s*:/g)
  for (const m of entries) localKeys.add(m[1])
}

const communityKeys = new Set()
const commSection = text.match(/const communityUrls = \{([\s\S]*?)\};/)
if (commSection) {
  const entries = commSection[1].matchAll(/['"]([^'"]+)['"]\s*:/g)
  for (const m of entries) communityKeys.add(m[1])
}

const products = []
for (const pm of productMatches) {
  const block = pm[0]
  const name = getName(block)
  if (name) products.push(name)
}

const missing = products.filter(p => !localKeys.has(p) && !communityKeys.has(p))

console.log('Total products:', products.length)
console.log('Products missing image mapping:', missing.length)
console.log(missing.join('\n'))

console.log('\nLocal images mapped:', localKeys.size)
console.log('Community images mapped:', communityKeys.size)
