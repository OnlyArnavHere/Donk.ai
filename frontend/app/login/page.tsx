'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { AuthShell, GoogleButton } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Resume the build." description="Sign in to continue designing with your hardware copilot.">
      <div className="space-y-5">
        <GoogleButton />
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or continue with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-medium">Work email</label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-12 rounded-xl bg-secondary/50"
              disabled={loading}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 rounded-xl bg-secondary/50"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Open workspace <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">New to DunkAI? <Link className="text-foreground underline underline-offset-4" href="/signup">Create an account</Link></p>
      </div>
    </AuthShell>
  )
}
