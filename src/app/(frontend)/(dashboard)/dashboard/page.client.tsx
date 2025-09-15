'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PaginatedDocs } from 'payload'
import type { CompanyUser, MsdsV2 } from '@/payload-types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DataTable } from './components/data-table'
import { getColumns, type Row } from './components/data-table/columns'
import SearchMsds from './components/search-msds'
import TablePagination from './components/table-pagination'

interface Props {
  serverData: {
    companyUsers: PaginatedDocs<CompanyUser> | null
    msdsV2: PaginatedDocs<MsdsV2> | null
    activeCompanyName: string | null
  }
}

export default function DashboardClient({ serverData: { companyUsers, msdsV2, activeCompanyName } }: Props) {
  const searchParams = useSearchParams()
  const t = useTranslations('dashboardPage')

  const msdsSearchParam = searchParams.get('name')

  const msdsContent = msdsV2?.docs
  const tableColumns = getColumns(t)

  const data: Row[] | null = Array.isArray(msdsContent)
    ? msdsContent?.map((item) => ({
      name: item?.name || '',
      msdsCreatedAt: item?.createdAt || '',
      msdsUpdatedAt: item?.updatedAt || '',
      formNo: item?.formNo || '',
      updatedCount: item?.updatedCount || 0,
      author: item?.author || '',
      certificateDate: item?.certificateDate || '',
      expiryDate: item?.expiryDate || '',
      url: item?.url || '',
      createdAt: item?.createdAt || '',
      contentLanguage: {
        id: typeof item?.contentLanguage === 'object'
          ? (item?.contentLanguage?.id ?? 0)
          : (Number(item?.contentLanguage) || 0),
        code: typeof item?.contentLanguage === 'object'
          ? (item?.contentLanguage?.code ?? '')
          : '',
        name: typeof item?.contentLanguage === 'object'
          ? (item?.contentLanguage?.name ?? '')
          : '',
        createdAt: typeof item?.contentLanguage === 'object'
          ? (item?.contentLanguage?.createdAt ?? '')
          : '',
        updatedAt: typeof item?.contentLanguage === 'object'
          ? (item?.contentLanguage?.updatedAt ?? '')
          : ''
      }
    }))
    : null

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        {activeCompanyName && (
          <p className="text-base font-medium text-foreground">
            {t('activeCompany')}: <span className="text-primary font-semibold">{activeCompanyName}</span>
          </p>
        )}
      </div>
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
        <CardContent className="p-0">
          <div className="p-6 pb-0">
            <SearchMsds />
          </div>
          <div className="p-6 pt-4">
            {Array.isArray(data) ? (
              <>
                <DataTable columns={tableColumns} data={data} />
                <div className="mt-4">
                  <TablePagination totalPages={msdsV2?.totalPages || 1} />
                </div>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
