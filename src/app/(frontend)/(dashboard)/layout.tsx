import { DashboardNav } from '@/components/frontend/dashboard-nav'
import { ThemeToggle } from '@/components/frontend/theme-toggle'
import { UserNav } from '@/components/frontend/user-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="text-xl font-bold text-primary">Doruk Sistem</div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex">
        <DashboardNav className="w-64 border-r min-h-[calc(100vh-4rem)]" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
