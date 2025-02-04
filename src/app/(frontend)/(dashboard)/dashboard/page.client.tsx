'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PaginatedDocs } from 'payload'
import type { CompanyUser, MsdsV2 } from '@/payload-types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DataTable } from './components/data-table'
import { columns, type Row } from './components/data-table/columns'
import SearchMsds from './components/search-msds'
import TablePagination from './components/table-pagination'

interface Props {
  serverData: {
    companyUsers: PaginatedDocs<CompanyUser> | null
    msdsV2: PaginatedDocs<MsdsV2> | null
  }
}

export default function DashboardClient({ serverData: { companyUsers, msdsV2 } }: Props) {
  const searchParams = useSearchParams()
  const t = useTranslations('dashboardPage')

  const msdsSearchParam = searchParams.get('name')

  const msdsContent = msdsV2?.docs

  const data: Row[] | null = Array.isArray(msdsContent)
    ? msdsContent?.map((item) => ({
        name: item?.name,
        msdsCreatedAt: item?.createdAt,
        msdsUpdatedAt: item?.updatedAt,
        formNo: item?.formNo,
        updatedCount: item?.updatedCount,
        author: item?.author,
        certificateDate: item?.certificateDate,
        url: item?.url,
        createdAt: item?.createdAt,
        contentLanguage: item?.contentLanguage,
      }))
    : null

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalMSDS')}
              {!!msdsSearchParam && <span className="text-primary"> ({t('filtered')})</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{msdsV2?.totalDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeCompanyUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyUsers?.totalDocs}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('msdsContent')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <SearchMsds />
          </div>
          {Array.isArray(data) ? (
            <>
              <DataTable columns={columns} data={data} />
              <TablePagination totalPages={msdsV2?.totalPages || 1} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
