import React from 'react'
import { ThemeToggle } from './theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-8">
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.4)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-100" />
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90" />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="container max-w-6xl relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {children}
      </div>
    </div>
  )
}
