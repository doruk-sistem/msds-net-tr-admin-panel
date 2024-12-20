import { DashboardNav } from '@/components/frontend/dashboard-nav'
import { UserNav } from '@/components/frontend/user-nav'
import AuthProvider from '@/providers/AuthProvider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <UserNav />
        <div className="flex">
          <DashboardNav className="w-64 border-r min-h-[calc(100vh-4rem)]" />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
