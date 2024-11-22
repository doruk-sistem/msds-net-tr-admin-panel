'use client'

import { DataTable } from '@/components/frontend/data-table'
import { columns, Row } from './columns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data - replace with actual API call
const data: Row[] = [
  {
    name: '1',
    msdsName: 'MSDS Content 1',
    qrCode: '123',
  },
  {
    name: '2',
    msdsName: 'MSDS Content 2',
    qrCode: '123',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active MSDS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Company Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  )
}
