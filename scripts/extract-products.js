import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  const srcPath = path.join(__dirname, '..', 'src', 'data', 'products.js')
  const outPath = path.join(__dirname, '..', 'server', 'data', 'products.json')
  const text = fs.readFileSync(srcPath, 'utf8')
  const start = text.indexOf('export const products = [')
  if (start === -1) throw new Error('products array not found')

  let i = text.indexOf('[', start)
  let depth = 0
  let end = -1
  for (; i < text.length; i++) {
    const ch = text[i]
    if (ch === '[') depth++
    if (ch === ']') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }

  if (end === -1) throw new Error('could not find closing ] for products array')

  const arrayText = text.slice(text.indexOf('[', start), end + 1)
  const jsCode = `const getProductImage = () => null;\nconst products = ${arrayText};\nproducts;`
  const products = vm.runInNewContext(jsCode)

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8')
  console.log('Wrote', products.length, 'products to', outPath)
} catch (error) {
  console.error('ERROR:', error)
  process.exit(1)
}
