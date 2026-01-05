const fs = require('fs')
const path = require('path')

const workspaceRoot = process.cwd()
const toolsIconsFile = path.resolve(workspaceRoot, 'src-modules', 'demo', 'components', 'tiptap', 'token', 'tools-icons.js')
const sourceDir = 'e:\\code\\liuk\\taiga-ui-main\\projects\\icons\\src'
const targetDir = path.resolve(workspaceRoot, 'src-modules', 'demo', 'assets', 'icons')

const readFile = p => fs.readFileSync(p, 'utf8')
const ensureDir = p => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

const evalToolsIcons = (code) => {
  const transformed = code.replace(/export\s+const\s+toolsIcons\s*=\s*/m, 'module.exports = ')
  const module = { exports: {} }
  const func = new Function('module', 'exports', transformed + '\nreturn module.exports;')
  return func(module, module.exports)
}

const walkSvgFiles = (dir) => {
  const results = []
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    let items
    try {
      items = fs.readdirSync(d, { withFileTypes: true })
    } catch (e) {
      continue
    }
    for (const it of items) {
      const full = path.join(d, it.name)
      if (it.isDirectory()) {
        stack.push(full)
      } else if (it.isFile() && it.name.toLowerCase().endsWith('.svg')) {
        results.push(full)
      }
    }
  }
  return results
}

const toName = (p) => path.basename(p).replace(/\.svg$/i, '').toLowerCase()

const flattenIconNames = (iconsObj) => {
  const names = new Set()
  for (const [k, v] of Object.entries(iconsObj)) {
    if (typeof v === 'string') {
      names.add(v.toLowerCase())
    } else if (v && typeof v === 'object') {
      for (const [, vv] of Object.entries(v)) {
        if (typeof vv === 'string') names.add(vv.toLowerCase())
      }
    }
  }
  return Array.from(names)
}

const main = () => {
  ensureDir(targetDir)
  const code = readFile(toolsIconsFile)
  const iconsObj = evalToolsIcons(code)
  const wanted = flattenIconNames(iconsObj)

  const svgFiles = walkSvgFiles(sourceDir)
  const index = new Map()
  for (const f of svgFiles) {
    const name = toName(f)
    if (!index.has(name)) index.set(name, [])
    index.get(name).push(f)
  }

  const findFileFor = (icon) => {
    const exact = index.get(icon)
    if (exact && exact.length) return exact[0]
    for (const [n, files] of index.entries()) {
      if (n.includes(icon)) return files[0]
    }
    return null
  }

  const copied = []
  const missing = []
  for (const icon of wanted) {
    const src = findFileFor(icon)
    if (!src) {
      missing.push(icon)
      continue
    }
    const dest = path.join(targetDir, `${icon}.svg`)
    fs.copyFileSync(src, dest)
    copied.push({ icon, src, dest })
  }

  console.log(`Copied: ${copied.length}`)
  console.log(`Missing: ${missing.length}`)
  if (missing.length) console.log(missing.join(', '))
}

main()

