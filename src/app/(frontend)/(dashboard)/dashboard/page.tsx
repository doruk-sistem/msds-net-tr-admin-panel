import { PaginatedDocs } from 'payload'

import type { CompanyUser, MsdsContent } from '@/payload-types'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import getMe from '@/utilities/getMe'

import DashboardClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams: searchParamsPromise }) {
  const { name, page } = await searchParamsPromise

  let msds: PaginatedDocs<MsdsContent> | null = null
  let companyUsers: PaginatedDocs<CompanyUser> | null = null

  try {
    const user = await getMe()

    const companyId = user?.company

    const payload = await getPayloadCMS()

    if (companyId) {
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
    }
  } catch (error) {
    msds = null
    console.error('DashboardPage error: ', error)
  }

  return <DashboardClient serverData={{ msds, companyUsers }} />
}
