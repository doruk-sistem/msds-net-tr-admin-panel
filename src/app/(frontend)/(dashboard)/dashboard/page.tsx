import { PaginatedDocs } from 'payload'

import type { CompanyUser, MsdsV2 } from '@/payload-types'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import getMe from '@/utilities/getMe'

import DashboardClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams: searchParamsPromise }) {
  const { name, page } = await searchParamsPromise

  let companyUsers: PaginatedDocs<CompanyUser> | null = null
  let msdsV2: PaginatedDocs<MsdsV2> | null = null

  try {
    const user = await getMe()

    const companyId = user?.company

    const payload = await getPayloadCMS()

    if (companyId) {
      const msdsV2Response = await payload.find({
        collection: 'msdsV2',
        depth: 2,
        sort: '-publishedAt',
        limit: 10,
        page: Number(page) || 1,
        where: {
          company: {
            equals: companyId,
          },
          isPublished: {
            equals: true,
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

      msdsV2 = msdsV2Response
      companyUsers = companyUsersResponse as any
    }
  } catch (error) {
    console.error('DashboardPage error: ', error)
  }

  return <DashboardClient serverData={{ companyUsers, msdsV2 }} />
}
