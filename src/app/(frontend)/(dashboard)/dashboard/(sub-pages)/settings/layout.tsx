import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/frontend/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'User Settings',
    href: '/dashboard/settings/profile',
  },
  {
    title: 'Company Settings',
    href: '/dashboard/settings/company',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and company settings</p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
