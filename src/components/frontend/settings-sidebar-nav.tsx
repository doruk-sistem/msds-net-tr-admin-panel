'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { useTranslations } from 'next-intl'

const items = [
  {
    title: 'sidebarNav.userSettings',
    href: '/dashboard/settings/profile',
  },
  {
    title: 'sidebarNav.companySettings',
    href: '/dashboard/settings/company',
  },
]

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export default function SettingsSidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations('settingsPage')

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {t(item.title as any)}
        </Link>
      ))}
    </nav>
  )
}
