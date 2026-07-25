'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download, FileText, Maximize2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const docs = [
  { title: 'System Architecture', file: 'architecture.pdf', size: '2.3 MB', pages: 8 },
  { title: 'Circuit Schematic', file: 'schematic.pdf', size: '1.8 MB', pages: 4 },
  { title: 'PCB Layout', file: 'pcb_layout.pdf', size: '3.1 MB', pages: 6 },
  { title: 'Validation Report', file: 'validation.pdf', size: '0.8 MB', pages: 12 },
]

export function DocsView({ projectId: _projectId }: { projectId?: string } = {}) {
  const [selected, setSelected] = useState(0)
  const [page, setPage] = useState(1)
  const doc = docs[selected]

  const selectDoc = (index: number) => {
    setSelected(index)
    setPage(1)
  }

  return (
    <div className="h-full overflow-auto bg-background p-5 lg:p-7">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Project files</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">Documentation</h2>
          </div>
          <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" />Download package</Button>
        </div>

        <div className="grid min-h-[600px] gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card p-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filter files" className="h-9 rounded-lg border-border bg-secondary/50 pl-9 text-xs" />
            </div>
            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Design package</p>
            <div className="space-y-1">
              {docs.map((item, index) => (
                <button key={item.file} onClick={() => selectDoc(index)} className={`w-full rounded-xl p-3 text-left transition-colors ${selected === index ? 'bg-secondary' : 'hover:bg-secondary/60'}`}>
                  <div className="flex gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{item.title}</p>
                      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{item.file}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[600px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-medium">{doc.title}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{doc.file} · {doc.size}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" title="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="min-w-16 text-center font-mono text-[10px] text-muted-foreground">{page} / {doc.pages}</span>
                <Button variant="ghost" size="icon" title="Next page" onClick={() => setPage((current) => Math.min(doc.pages, current + 1))}><ChevronRight className="h-4 w-4" /></Button>
                <div className="ml-2 h-5 w-px bg-border" />
                <Button variant="ghost" size="icon" title="Full screen"><Maximize2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex flex-1 items-start justify-center overflow-auto bg-secondary/35 p-6 lg:p-10">
              <article className="min-h-[670px] w-full max-w-[720px] rounded-sm border border-border bg-background px-8 py-10 text-foreground shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:px-14">
                <div className="flex items-start justify-between border-b border-border pb-7">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">DUNKAI / ENGINEERING PACKAGE</p>
                    <h3 className="mt-4 font-display text-3xl">{doc.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">Smart IoT Sensor Hub · Revision 03</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{String(page).padStart(2, '0')}</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-b border-border pb-8 sm:grid-cols-4">
                  {['Owner|DunkAI Systems', 'Status|Review ready', 'Format|PDF / A4', 'Updated|Today'].map((item) => {
                    const [label, value] = item.split('|')
                    return <div key={label}><p className="font-mono text-[9px] uppercase text-muted-foreground">{label}</p><p className="mt-2 text-xs">{value}</p></div>
                  })}
                </div>
                <h4 className="mt-10 text-sm font-medium">Engineering notes</h4>
                <p className="mt-4 max-w-2xl text-xs leading-6 text-muted-foreground">This document is part of the manufacturing handoff for the current sensor hub design. Review the highlighted constraints, interface decisions, and verification notes before exporting fabrication files.</p>
                <div className="mt-8 space-y-3"><div className="h-2 w-4/5 rounded-full bg-secondary" /><div className="h-2 w-full rounded-full bg-secondary" /><div className="h-2 w-11/12 rounded-full bg-secondary" /><div className="mt-8 h-36 rounded-xl border border-dashed border-border bg-secondary/30" /></div>
                <div className="mt-14 flex items-center justify-between border-t border-border pt-4 font-mono text-[9px] text-muted-foreground"><span>CONFIDENTIAL · INTERNAL DESIGN REVIEW</span><span>DUNKAI</span></div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
