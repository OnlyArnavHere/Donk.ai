'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={sent ? 'Check your inbox.' : 'Reset your password.'}
      description={sent ? "If an account exists for that email, we've sent a secure reset link." : "Enter your work email and we'll send you a secure link to get back into your workspace."}
    >
      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-medium">Reset link sent</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">The link will expire in 30 minutes. Check your spam folder if it doesn't arrive.</p>
            </div>
          </div>
          <Button variant="outline" className="h-12 w-full rounded-xl" onClick={() => setSent(false)}>Use a different email</Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link className="inline-flex items-center gap-2 text-foreground underline underline-offset-4" href="/login">
              <ArrowLeft className="h-3.5 w-3.5" />Back to sign in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="recovery-email" className="mb-2 block text-xs font-medium">Work email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="recovery-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl bg-secondary/50 pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link className="inline-flex items-center gap-2 text-foreground underline underline-offset-4" href="/login">
              <ArrowLeft className="h-3.5 w-3.5" />Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}
