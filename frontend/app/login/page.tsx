'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AuthShell, GoogleButton } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  return <AuthShell eyebrow="Welcome back" title="Resume the build." description="Sign in to continue designing with your hardware copilot."><div className="space-y-5"><GoogleButton/><div className="flex items-center gap-3"><div className="h-px flex-1 bg-border"/><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or continue with email</span><div className="h-px flex-1 bg-border"/></div><form action="/workspace" className="space-y-4"><div><label htmlFor="email" className="mb-2 block text-xs font-medium">Work email</label><Input id="email" required type="email" placeholder="you@company.com" className="h-12 rounded-xl bg-secondary/50"/></div><div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-xs font-medium">Password</label><Link href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Forgot password?</Link></div><Input id="password" required type="password" placeholder="Enter your password" className="h-12 rounded-xl bg-secondary/50"/></div><Button type="submit" className="h-12 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">Open workspace <ArrowRight className="ml-2 h-4 w-4"/></Button></form><p className="text-center text-sm text-muted-foreground">New to DunkAI? <Link className="text-foreground underline underline-offset-4" href="/signup">Create an account</Link></p></div></AuthShell>
}
