'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { FileText, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { useTranslations } from 'next-intl'
import { MsdsRequestButton } from '../MsdsRequest'
import { FC } from 'react'


interface DashboardNavItem {
  title: string
  component?: FC<any> // Component tipini FC (Function Component) olarak belirt
  icon?: FC<any>
  href?: string
}

const items: DashboardNavItem[] = [
  {
    title: 'dashboardNav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'dashboardNav.msdsList',
    href: '/dashboard/msds-requests',
    icon: FileText,
  },
  {
    title: 'dashboardNav.settings',
    href: '/dashboard/settings/profile',
    icon: Settings,
  },
]

export function DashboardNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations('common')

  return (
    <nav className={cn('space-y-2 p-4', className)} {...props}>
      {items.map((item) => {

        if ('component' in item && item.component) {
          const Component = item.component
          return (
            <div key={item.title} className="flex items-center gap-2 px-3 py-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              <Component />
            </div>
          )
        }

        if ('href' in item && item.href) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {t(item.title as any)}
            </Link>
          )
        }

        return null
      })}
    </nav>
  )
}
