'use client'

import { Separator } from '@/components/ui/separator'
import SettingsSidebarNav from '@/components/frontend/settings-sidebar-nav'
import { useTranslations } from 'next-intl'

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = useTranslations('settingsPage')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SettingsSidebarNav />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
