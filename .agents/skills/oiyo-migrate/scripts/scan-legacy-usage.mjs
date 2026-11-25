#!/usr/bin/env node
/**
 * oiyo 迁移只读扫描。
 *
 * 用法：node scan-legacy-usage.mjs [project-root]
 *
 * 只读取文件并打印报告，不修改任何内容。用于迁移前盘点旧依赖、旧入口、
 * 旧配置写法与缺失的 1.0.0 前置条件。
 */

import { existsSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import process from 'node:process'

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.oiyo',
  'unpackage',
  '.hbuilderx',
  '.idea',
  '.vscode',
  'coverage',
  '.turbo',
  '.nuxt',
])

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.vue',
  '.nvue',
  '.json',
  '.md',
  '.mts',
  '.cts',
])

const MAX_FILE_SIZE = 512 * 1024

const LEGACY_PATTERNS = [
  { id: 'legacy-package', label: '@skiyee/oiyo', regex: /@skiyee\/oiyo\b/g },
  { id: 'internal-core', label: '@oiyo/core', regex: /@oiyo\/core\b/g },
  { id: 'internal-config', label: '@oiyo/config', regex: /@oiyo\/config\b/g },
  { id: 'internal-framework', label: '@oiyo/framework', regex: /@oiyo\/framework\b/g },
  { id: 'internal-plugin', label: '@oiyo/plugin', regex: /@oiyo\/plugin\b/g },
  { id: 'internal-cli', label: '@oiyo/cli', regex: /@oiyo\/cli\b/g },
  { id: 'legacy-forwarder', label: '@oiyo/uni-app', regex: /@oiyo\/uni-app\b/g },
  { id: 'legacy-forwarder', label: '@oiyo/uni', regex: /@oiyo\/uni(?!-app\b|app\b)\b/g },
  { id: 'removed-entry', label: 'oiyo/global', regex: /(?<!@skiyee\/)oiyo\/global\b/g },
  { id: 'removed-value', label: 'defaultConfig', regex: /\bdefaultConfig\b/g },
]

const CONFIG_REVIEW_PATTERNS = [
  { label: 'dir 路径', kind: 'dir', regex: /^\s*(mainPackage|layouts|middlewares)\s*:/ },
  { label: 'subPackages', kind: 'dir', regex: /^\s*subPackages\s*:/ },
  { label: 'scan 来源', kind: 'scan', regex: /^\s*(apis|components)\s*:/ },
  { label: 'ide 配置', kind: 'ide', regex: /^\s*ide\s*:/ },
  { label: 'ci 配置', kind: 'ci', regex: /^\s*ci\s*:/ },
]

const root = resolve(process.argv[2] ?? process.cwd())

function log(line = '') {
  process.stdout.write(`${line}\n`)
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  }
  catch {
    return null
  }
}

async function walk(dir, files = []) {
  let entries

  try {
    entries = await readdir(dir, { withFileTypes: true })
  }
  catch {
    return files
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue
      }

      await walk(join(dir, entry.name), files)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const filePath = join(dir, entry.name)
    const dotIndex = entry.name.lastIndexOf('.')
    const extension = dotIndex === -1 ? '' : entry.name.slice(dotIndex)

    if (!TEXT_EXTENSIONS.has(extension)) {
      continue
    }

    try {
      const info = await stat(filePath)

      if (info.size > MAX_FILE_SIZE) {
        continue
      }
    }
    catch {
      continue
    }

    files.push(filePath)
  }

  return files
}

function lineNumberAt(source, index) {
  let line = 1

  for (let i = 0; i < index; i++) {
    if (source[i] === '\n') {
      line++
    }
  }

  return line
}

function parseSrcDir(source) {
  const match = source.match(/\bsrcDir\s*:\s*['"]([^'"]+)['"]/)
  return match?.[1] ?? 'src'
}

function quotedValues(line) {
  return [...line.matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1])
}

function joinFrom(root, base, value) {
  return isAbsolute(base) ? join(base, value) : join(root, base, value)
}

function describePath(value, root, srcDir, kind) {
  const normalizedSrc = srcDir.replace(/[\\/]+$/, '')

  if (isAbsolute(value)) {
    return existsSync(value) ? '绝对路径存在' : '绝对路径不存在，请核对'
  }

  if (value.startsWith('./') || value.startsWith('../')) {
    return existsSync(resolve(root, value)) ? '已是 rootDir 相对路径' : '路径不存在，请核对'
  }

  const globIndex = value.search(/[*?[\]{}]/)
  const base = globIndex === -1 ? value : value.slice(0, globIndex).replace(/\/+$/, '')
  const candidates = [
    { label: `${normalizedSrc}/${value}`, target: joinFrom(root, normalizedSrc, globIndex === -1 ? value : base) },
    { label: value, target: join(root, globIndex === -1 ? value : base) },
  ]
  const matches = candidates.filter(candidate => existsSync(candidate.target))

  if (matches.length) {
    return `存在，建议改为 ${matches.map(candidate => `'./${candidate.label}'`).join(' 或 ')}`
  }

  if (kind === 'scan') {
    return '未找到同名本地目录；若是包说明符保持原样，否则改为 \'./src/...\' 或删除该条目'
  }

  return '未找到，建议删除该条目并依赖默认值'
}

function packageDependencyNames(pkg) {
  const groups = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
  const names = new Map()

  for (const group of groups) {
    for (const [name, version] of Object.entries(pkg?.[group] ?? {})) {
      names.set(name, `${group}: ${version}`)
    }
  }

  for (const key of ['overrides', 'resolutions']) {
    for (const name of Object.keys(pkg?.[key] ?? {})) {
      names.set(name, `${key}: ${name}`)
    }
  }

  return names
}

async function main() {
  const pkgPath = join(root, 'package.json')
  const pkg = await readJson(pkgPath)

  if (!pkg) {
    log(`无法读取 ${pkgPath}`)
    log('请把项目根目录作为参数传入：node scan-legacy-usage.mjs <project-root>')
    process.exitCode = 1
    return
  }

  log(`oiyo 迁移扫描：${root}`)
  log()

  log('## 依赖与工程字段')

  const dependencyNames = packageDependencyNames(pkg)
  const legacyDependencies = [...dependencyNames.entries()]
    .filter(([name]) => /^@skiyee\/oiyo$|^@oiyo\/(?:core|config|framework|plugin|cli)$|^@oiyo\/uni(?:-app)?$/.test(name))

  if (legacyDependencies.length) {
    for (const [name, where] of legacyDependencies) {
      log(`- 旧依赖：${name}（${where}）`)
    }
  }
  else {
    log('- 未发现旧依赖')
  }

  const findings = []

  if (pkg.type !== 'module') {
    findings.push('- 缺少 `"type": "module"`（1.0.0 只发布 ESM）')
  }

  if (!dependencyNames.has('oiyo')) {
    findings.push('- 缺少 `oiyo` 依赖')
  }

  if (!dependencyNames.has('vite')) {
    findings.push('- 缺少 `vite` 依赖（可选 peer，不会自动安装）')
  }

  const nodeEngine = pkg.engines?.node

  if (nodeEngine && !/\^?20\.19|\^?22\.12|>=\s*2[02]/.test(nodeEngine)) {
    findings.push(`- engines.node 可能过低：${nodeEngine}（需要 ^20.19.0 || >=22.12.0）`)
  }

  if (findings.length) {
    for (const finding of findings) {
      log(finding)
    }
  }
  else {
    log('- 工程字段符合 1.0.0 要求')
  }

  log()

  const files = await walk(root)
  const hits = new Map(LEGACY_PATTERNS.map(pattern => [pattern.label, []]))
  const configHits = []
  let configSrcDir = 'src'

  for (const filePath of files) {
    const relativePath = relative(root, filePath).split(sep).join('/')
    let source

    try {
      source = await readFile(filePath, 'utf8')
    }
    catch {
      continue
    }

    for (const pattern of LEGACY_PATTERNS) {
      pattern.regex.lastIndex = 0

      for (const match of source.matchAll(pattern.regex)) {
        hits.get(pattern.label).push({
          file: relativePath,
          line: lineNumberAt(source, match.index ?? 0),
        })
      }
    }

    if (/(?:^|\/)oiyo\.config\.[cm]?[jt]s$/.test(relativePath)) {
      configSrcDir = parseSrcDir(source)

      const lines = source.split('\n')

      lines.forEach((line, index) => {
        if (line.trimStart().startsWith('//')) {
          return
        }

        for (const pattern of CONFIG_REVIEW_PATTERNS) {
          if (pattern.regex.test(line)) {
            configHits.push({
              file: relativePath,
              line: index + 1,
              label: pattern.label,
              kind: pattern.kind,
              text: line.trim(),
            })
            break
          }
        }
      })
    }
  }

  log('## 源码引用')

  let totalHits = 0

  for (const [label, entries] of hits) {
    if (!entries.length) {
      continue
    }

    totalHits += entries.length
    log(`- ${label}：${entries.length} 处`)

    for (const entry of entries.slice(0, 20)) {
      log(`  - ${entry.file}:${entry.line}`)
    }

    if (entries.length > 20) {
      log(`  - ……另有 ${entries.length - 20} 处`)
    }
  }

  if (totalHits === 0) {
    log('- 未发现旧入口引用')
  }

  log()
  log('## oiyo.config 需要人工核对的片段')

  if (!configHits.length) {
    log('- 未发现 oiyo.config.* 或其中没有需要核对的路径字段')
  }
  else {
    for (const entry of configHits) {
      log(`- ${entry.file}:${entry.line} [${entry.label}] ${entry.text}`)

      if (entry.kind === 'dir' || entry.kind === 'scan') {
        const values = quotedValues(entry.text).filter(value => !value.startsWith('@'))

        for (const value of values) {
          log(`  - ${value} → ${describePath(value, root, configSrcDir, entry.kind)}`)
        }
      }
    }
    log('- 本地路径必须以 `./` 开头并相对 rootDir；分包容器以 `/*` 结尾')
  }

  log()
  log(`扫描文件：${files.length}`)
  log('注意：扫描不到不等于不需要改，仍需检查 vite.config、App.vue、main.ts、pages.config、manifest.config 与手写 .d.ts。')
}

await main()
