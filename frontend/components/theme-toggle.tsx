'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // Avoid hydration mismatch: theme is unknown until mounted on the client
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const light = mounted && resolvedTheme === 'light'
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(light ? 'dark' : 'light')}
      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
    >
      {light ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </Button>
  )
}
