'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AuthShell, GoogleButton } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignupPage() {
  return <AuthShell eyebrow="Start building" title="Make the first move." description="Create your workspace and turn the next hardware idea into a board-ready plan."><div className="space-y-5"><GoogleButton/><div className="flex items-center gap-3"><div className="h-px flex-1 bg-border"/><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or use email</span><div className="h-px flex-1 bg-border"/></div><form action="/workspace" className="space-y-4"><div><label htmlFor="name" className="mb-2 block text-xs font-medium">Your name</label><Input id="name" required placeholder="Alex Morgan" className="h-12 rounded-xl bg-secondary/50"/></div><div><label htmlFor="email" className="mb-2 block text-xs font-medium">Work email</label><Input id="email" required type="email" placeholder="you@company.com" className="h-12 rounded-xl bg-secondary/50"/></div><div><label htmlFor="password" className="mb-2 block text-xs font-medium">Create a password</label><Input id="password" required type="password" placeholder="At least 8 characters" className="h-12 rounded-xl bg-secondary/50"/></div><Button type="submit" className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">Create workspace <ArrowRight className="ml-2 h-4 w-4"/></Button><p className="text-center text-[11px] leading-5 text-muted-foreground">By continuing, you agree to DunkAI’s terms and privacy policy.</p></form><p className="text-center text-sm text-muted-foreground">Already have an account? <Link className="text-foreground underline underline-offset-4" href="/login">Sign in</Link></p></div></AuthShell>
}
