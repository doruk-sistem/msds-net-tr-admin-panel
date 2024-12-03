import getPayloadCMS from '@/utilities/getPayloadCMS'

import DashboardClient from './page.client'
import { PaginatedDocs } from 'payload'
import type { CompanyUser, MsdsContent } from '@/payload-types'
import getAuthSession from '@/utilities/getAuthSession'

export default async function DashboardPage({ searchParams: searchParamsPromise }) {
  const session = await getAuthSession()
  const { name, page } = await searchParamsPromise

  const companyId = session?.user?.company

  let msds: PaginatedDocs<MsdsContent> | null = null
  let companyUsers: PaginatedDocs<CompanyUser> | null = null

  try {
    const payload = await getPayloadCMS()

    const msdsResponse = await payload.find({
      depth: 2,
      collection: 'msdsContents',
      sort: '-publishedAt',
      limit: 10,
      page: Number(page) || 1,
      where: {
        company: {
          equals: companyId,
        },
        ...(!!name
          ? {
              name: {
                like: name,
              },
            }
          : {}),
      },
    })

    const companyUsersResponse = await payload.find({
      collection: 'companyUsers',
      depth: 0,
      where: {
        company: {
          equals: companyId,
        },
      },
      select: {
        fullname: true,
      },
    })

    msds = msdsResponse as any
    companyUsers = companyUsersResponse as any
  } catch (error) {
    msds = null
    console.error('DashboardPage error: ', error)
  }

  return <DashboardClient serverData={{ msds, companyUsers }} />
}
