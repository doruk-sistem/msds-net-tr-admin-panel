import { MsdsRequestsList } from '@/components/msds-request/MsdsRequestsList'
import { MsdsRequestButton } from '@/components/msds-request/MsdsRequestButton'

export default function MsdsRequestsPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">MSDS Taleplerim</h1>
          <MsdsRequestButton />
        </div>
        <MsdsRequestsList />
      </div>
    </main>
  )
}