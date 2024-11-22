'use client'

import Link from 'next/link'
import { LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/utilities/cn'

const items = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav className={cn('space-y-2 p-4', className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
