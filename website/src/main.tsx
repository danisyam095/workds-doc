import React, { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { createRoot } from 'react-dom/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Separator } from './components/ui/separator'
import { ScrollArea } from './components/ui/scroll-area'
import { cn } from './lib/utils'
import './styles.css'

type Category = 'root' | 'agent' | 'business' | 'architecture' | 'backend' | 'api' | 'features' | 'testing' | 'planning' | 'operations' | 'archive'
type DocumentEntry = { path: string; title: string; category: Category; error?: boolean }

const categoryLabels: Record<Category, string> = {
  root: 'Mulai di sini',
  agent: 'Panduan AI',
  business: 'Business',
  architecture: 'Architecture',
  backend: 'Backend',
  api: 'API',
  features: 'Features',
  testing: 'Testing',
  planning: 'Planning',
  operations: 'Operations',
  archive: 'Arsip',
}

const categoryOrder: Category[] = ['root', 'business', 'architecture', 'backend', 'api', 'features', 'testing', 'planning', 'operations', 'agent', 'archive']

function pathFromHash() {
  const value = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  return value || '00-INDEX.md'
}

function titleFromPath(path: string) {
  return (path.split('/').pop() ?? '').replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ')
}

function categoryFromPath(path: string) {
  return path.includes('/') ? path.split('/')[0] : 'root'
}

function App() {
  const [documents, setDocuments] = useState<DocumentEntry[]>([])
  const [selectedPath, setSelectedPath] = useState(pathFromHash)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('docs-theme') !== 'light')
  const [openCategories, setOpenCategories] = useState<Set<Category>>(
    () => new Set(['root', 'business']),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('docs-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    fetch('./content/manifest.json')
      .then((response) => {
        if (!response.ok) throw new Error('Manifest dokumentasi tidak tersedia.')
        return response.json()
      })
      .then((entries: DocumentEntry[]) => setDocuments(entries))
      .catch((error: Error) => setDocuments([{ path: '00-INDEX.md', title: error.message, category: 'root', error: true }]))

    const onHashChange = () => setSelectedPath(pathFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return documents
    return documents.filter((document) => `${document.title} ${document.path}`.toLowerCase().includes(normalized))
  }, [documents, query])

  const groupedDocuments = useMemo(() => categoryOrder.reduce<Record<Category, DocumentEntry[]>>((groups, category) => {
    groups[category] = filteredDocuments.filter((document) => document.category === category)
    return groups
  }, {} as Record<Category, DocumentEntry[]>), [filteredDocuments])

  const selected = documents.find((document) => document.path === selectedPath) || documents[0]
  const toggleCategory = (category: Category) => {
    setOpenCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-3 border-b border-border bg-background/80 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sm:h-[72px] sm:flex-nowrap sm:gap-7 sm:px-8 sm:py-0">
        <a className="flex min-w-0 items-center gap-3 sm:min-w-[240px]" href="#/00-INDEX.md">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground">MA</span>
          <span><strong className="block text-xs tracking-wide sm:text-sm">Marketing Assistant</strong><small className="mt-0.5 block text-[11px] text-muted-foreground">Documentation</small></span>
        </a>
        <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
          <div className="order-3 flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-card px-3 text-muted-foreground sm:order-1 sm:w-[min(520px,40vw)] sm:flex-none">
            <Search size={16} aria-hidden="true" />
            <Input className="h-10 min-w-0 flex-1 border-0 px-0 shadow-none focus-visible:ring-0" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari dokumentasi..." />
            <kbd className="hidden rounded border border-input px-1.5 py-0.5 text-[10px] sm:block">Ctrl K</kbd>
          </div>
          <Button
            className="order-2 text-muted-foreground hover:text-foreground sm:order-2"
            size="icon"
            onClick={() => setDarkMode((enabled) => !enabled)}
            aria-label={darkMode ? 'Tema gelap aktif. Klik untuk menggunakan tema terang.' : 'Tema terang aktif. Klik untuk menggunakan tema gelap.'}
            aria-pressed={darkMode}
            title={darkMode ? 'Tema gelap aktif' : 'Tema terang aktif'}
          >
            {darkMode ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          </Button>
          <Button
            className="order-1 text-foreground sm:hidden"
            size="icon"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </Button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px]">
        {mobileOpen && <button className="fixed inset-0 z-20 bg-black/50 sm:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" />}
        <aside className={cn('fixed left-0 top-[116px] z-30 hidden h-[calc(100dvh-116px)] w-[min(270px,86vw)] border-r border-border bg-card px-3 py-4 sm:top-[72px] sm:block sm:h-[calc(100dvh-72px)] sm:w-[240px] sm:bg-background sm:pb-10 sm:pt-5', mobileOpen && 'block')}>
          <ScrollArea className="h-full">
          <div className="mb-3 px-2 pb-3">
            <span className="text-[10px] uppercase tracking-[.1em] text-muted-foreground">Knowledge base</span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Panduan coding untuk manusia dan AI.</p>
          </div>
          <Separator className="mb-3" />
          <nav>
            {categoryOrder.map((category) => groupedDocuments[category]?.length ? (
              <section className="mb-1" key={category}>
                <button
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[10px] uppercase tracking-[.08em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => toggleCategory(category)}
                  aria-expanded={openCategories.has(category)}
                >
                  <span>{categoryLabels[category]}</span>
                  <ChevronDown className={cn('size-3.5 transition-transform', openCategories.has(category) && 'rotate-180')} />
                </button>
                {openCategories.has(category) && (
                  <div className="mt-0.5">
                    {groupedDocuments[category].map((document) => (
                      <a
                        className={cn('block border-l-2 border-transparent px-2 py-1 text-xs leading-snug text-muted-foreground transition-colors hover:text-foreground', document.path === selected?.path && 'border-primary bg-primary/10 text-primary')}
                        href={`#/${encodeURIComponent(document.path)}`}
                        onClick={() => setMobileOpen(false)}
                        key={document.path}
                      >
                        {document.title}
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ) : null)}
          </nav>
          </ScrollArea>
        </aside>
        <main className="min-w-0 flex-1 px-4 pb-20 pt-9 sm:ml-[240px] sm:px-7 sm:pt-14 md:px-[7vw]">
          {selected ? <Document document={selected} /> : <div className="text-muted-foreground">Dokumentasi sedang dimuat...</div>}
        </main>
      </div>
    </div>
  )
}

type MarkdownLinkProps = ComponentProps<'a'>

function Document({ document }: { document: DocumentEntry }) {
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (document.error) {
      setError(document.title)
      return
    }
    setMarkdown('')
    setError('')
    fetch(`./content/${document.path}`)
      .then((response) => {
        if (!response.ok) throw new Error('Dokumen tidak dapat dibaca.')
        return response.text()
      })
      .then(setMarkdown)
      .catch((reason: Error) => setError(reason.message))
  }, [document])

  return (
    <article className="prose-doc max-w-[850px]">
      <div className="mb-7 flex items-center gap-2 overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-[.05em] text-muted-foreground sm:text-[11px]">
        <span>{categoryLabels[document.category]}</span>
        <span>/</span>
        <span>{document.path}</span>
      </div>
      {error ? <div className="rounded-lg border border-rose-800 bg-rose-950/60 p-4 text-rose-200">{error}</div> : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }: MarkdownLinkProps) => {
              if (!href || href.startsWith('#') || href.startsWith('http')) {
                return <a href={href} {...props}>{children}</a>
              }
              const [target] = href.split('#')
              const base = document.path.includes('/') ? document.path.split('/').slice(0, -1).join('/') : ''
              const resolved = new URL(target, `https://docs.local/${base ? `${base}/` : ''}`).pathname.replace(/^\//, '')
              return <a href={`#/${encodeURIComponent(resolved)}`} {...props}>{children}</a>
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      )}
    </article>
  )
}

window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    document.querySelector<HTMLInputElement>('.search input')?.focus()
  }
})

const root = document.getElementById('root')
if (!root) throw new Error('Root element tidak ditemukan.')
createRoot(root).render(<App />)
