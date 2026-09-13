import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const websiteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(websiteDir, '..', 'docs')
const destination = resolve(websiteDir, 'public', 'content')

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true })

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await markdownFiles(fullPath))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath)
  }
  return files
}

const manifest = (await markdownFiles(source))
  .map((file) => {
    const path = relative(source, file).replaceAll('\\', '/')
    const category = path.includes('/') ? path.split('/')[0] : 'root'
    const title = path.split('/').pop().replace(/\.md$/, '').replace(/^\d+-/, '').replaceAll('-', ' ')
    return { path, category, title }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

await writeFile(resolve(destination, 'manifest.json'), JSON.stringify(manifest, null, 2))
