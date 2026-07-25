'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUp, Loader2, Mic, Paperclip, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkspaceStore } from '@/lib/store'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

const suggestions = ['Design a low-power sensor board', 'Review my power architecture', 'Create a KiCad starter project']
const placeholderPrompts = [
  'Design an IoT temperature sensor with WiFi...',
  'Create a low-power wearable board...',
  'Review my power architecture...',
]

export function ChatInterface({ projectId }: { projectId: string }) {
  const { pendingPrompt, setPendingPrompt } = useWorkspaceStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (input) return
    const prompt = placeholderPrompts[placeholderIndex]
    if (placeholder.length < prompt.length) {
      const timer = window.setTimeout(() => setPlaceholder(prompt.slice(0, placeholder.length + 1)), 42)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      setPlaceholder('')
      setPlaceholderIndex((current) => (current + 1) % placeholderPrompts.length)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [input, placeholder, placeholderIndex])

  const runAgent = useCallback((request: string) => {
    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: 'user', content: request }])
    setLoading(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: `I'll turn "${request}" into a hardware plan. I'm checking requirements, power budget, connectivity, component availability, and manufacturing constraints before I propose the architecture.`,
        },
      ])
      setLoading(false)
    }, 900)
  }, [])

  // Auto-run the prompt handed off from the new-project screen (Gemini-style)
  useEffect(() => {
    if (pendingPrompt) {
      const prompt = pendingPrompt
      setPendingPrompt(null)
      runAgent(prompt)
    }
  }, [pendingPrompt, setPendingPrompt, runAgent])

  // Reset conversation when switching projects
  useEffect(() => {
    setMessages([])
    setInput('')
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = () => {
    if (!input.trim() || loading) return
    const request = input.trim()
    setInput('')
    runAgent(request)
  }

  const composer = (
    <div className="mx-auto w-full max-w-[780px] px-5">
      <div className="flex h-[58px] items-center gap-2 rounded-full border border-foreground/15 bg-card/90 px-3 shadow-[0_14px_50px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors focus-within:border-foreground/35">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground" title="Attach a file">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              send()
            }
          }}
          placeholder={placeholder || placeholderPrompts[0]}
          className="h-10 flex-1 border-0 bg-transparent px-1 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground" title="Use voice input">
          <Mic className="h-4 w-4" />
        </Button>
        <Button onClick={send} disabled={!input.trim() || loading} size="icon" className="h-9 w-9 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </Button>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">DunkAI can make mistakes. Review generated engineering decisions before manufacturing.</p>
    </div>
  )

  // Empty conversation — centered hero composer
  if (!messages.length && !loading) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4 pb-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.07] blur-[90px]" />
        <div className="relative z-10 mb-8 flex max-w-[720px] flex-col items-center text-center">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-secondary/90">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">What are you building?</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Describe a hardware idea, ask for a design review, or bring an existing board into the workspace.</p>
        </div>
        <div className="relative z-10 w-full">{composer}</div>
        <div className="relative z-10 mt-7 flex max-w-[760px] flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => setInput(suggestion)} className="rounded-full border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground">
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Active conversation — messages above, composer pinned to the bottom
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 px-5 py-10">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <div className={`max-w-[680px] text-sm leading-7 ${message.role === 'user' ? 'rounded-2xl bg-secondary px-4 py-3' : 'text-foreground'}`}>{message.content}</div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="animate-pulse">Working through the design constraints...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="border-t border-border bg-background/90 py-5 backdrop-blur-xl">{composer}</div>
    </div>
  )
}
