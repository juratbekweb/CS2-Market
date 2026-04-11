import fs from 'fs'

const text = fs.readFileSync('./src/data/products.js', 'utf8')

const getKeys = (name) => {
  const match = text.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\};`))
  if (!match) return []
  const section = match[1]
  return [...section.matchAll(/["']((?:\\.|[^"'\\])*)["']\s*:/g)].map((value) =>
    value[1].replace(/\\'/g, "'").replace(/\\"/g, '"')
  )
}

const productNames = [...text.matchAll(/image:\s*getProductImage\(\s*["']((?:\\.|[^"'\\])*)["']\s*\)/g)].map((value) =>
  value[1].replace(/\\'/g, "'").replace(/\\"/g, '"')
)
const localKeys = new Set(getKeys('localImages'))
const communityKeys = new Set(getKeys('communityUrls'))

const missingLocal = productNames.filter((name) => !localKeys.has(name))
const missingCommunity = productNames.filter((name) => !communityKeys.has(name))

console.log('Total products:', productNames.length)
console.log('Products without localImages mapping:', missingLocal.length)
console.log(missingLocal.join('\n'))
console.log('Products without communityUrls mapping:', missingCommunity.length)
console.log(missingCommunity.join('\n'))
