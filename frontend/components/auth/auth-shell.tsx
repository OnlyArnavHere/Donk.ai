'use client'

import Link from 'next/link'
import { CircuitBoard, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function AuthShell({ children, eyebrow, title, description }: { children: React.ReactNode; eyebrow: string; title: string; description: string }) {
  const { theme, setTheme } = useTheme()
  const light = theme === 'light'
  return <main className="relative min-h-screen overflow-hidden bg-background text-foreground noise-overlay"><div className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.055] blur-[120px]"/><header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10"><Link href="/" className="flex items-center gap-2"><span className="font-display text-xl tracking-tight">DunkAI</span><span className="font-mono text-[9px] tracking-wide text-muted-foreground">COPILOT</span></Link><Button variant="outline" size="icon" aria-label="Toggle theme" onClick={() => setTheme(light ? 'dark' : 'light')} className="h-9 w-9 rounded-full border-border bg-card/60">{light ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}</Button></header><section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28 sm:px-8"><div className="w-full max-w-[430px]"><div className="mb-8 flex flex-col items-center text-center"><div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-secondary/70 shadow-sm"><CircuitBoard className="h-4 w-4 text-muted-foreground"/></div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p><h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight">{title}</h1><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p></div><div className="rounded-[28px] border border-border bg-card/65 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">{children}</div><p className="mt-8 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">Secure workspace access · DunkAI systems</p></div></section></main>
}

export function GoogleButton() {
  return <Button type="button" variant="outline" className="h-12 w-full rounded-xl border-border bg-background/60 hover:bg-secondary"><span className="mr-3 font-semibold text-base">G</span>Continue with Google</Button>
}
