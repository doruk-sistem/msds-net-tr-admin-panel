'use client'

import { PaginatedDocs } from 'payload'
import { CompanyUser, Msd } from '@/payload-types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DataTable } from './components/data-table'
import { columns, type Row } from './components/data-table/columns'
import SearchMsds from './components/search-msds'
import TablePagination from './components/table-pagination'
import { useSearchParams } from 'next/navigation'

interface Props {
  serverData: {
    msds: PaginatedDocs<Msd> | null
    companyUsers: PaginatedDocs<CompanyUser> | null
  }
}

export default function DashboardClient({ serverData: { msds, companyUsers } }: Props) {
  const searchParams = useSearchParams()

  const msdsSearchParam = searchParams.get('name')

  const msdsContent = msds?.docs

  const data: Row[] | null = Array.isArray(msdsContent)
    ? msdsContent?.map((item) => ({
        name: item.msdsName,
        publishedAt: item.publishedAt,
        fileName: item.filename,
        contentUrl: item.url,
      }))
    : null

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total MSDS
              {!!msdsSearchParam && <span className="text-primary"> (Filtered)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{msds?.totalDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Company Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyUsers?.totalDocs}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>MSDS Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <SearchMsds />
          </div>
          {Array.isArray(data) ? (
            <>
              <DataTable columns={columns} data={data} />
              <TablePagination totalPages={msds?.totalPages || 1} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
