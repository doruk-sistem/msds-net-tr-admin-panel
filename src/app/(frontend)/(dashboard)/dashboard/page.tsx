import getPayloadCMS from '@/utilities/getPayloadCMS'

import DashboardClient from './page.client'
import { PaginatedDocs } from 'payload'
import { Msd } from '@/payload-types'
import getAuthSession from '@/utilities/getAuthSession'

export default async function DashboardPage() {
  const session = await getAuthSession()

  const companyId = session?.user?.company

  let msdsContent: PaginatedDocs<Msd>['docs'] | null = null

  try {
    const payload = await getPayloadCMS()

    const msdsResponse = await payload.find({
      depth: 0,
      collection: 'msds',
      sort: '-publishedAt',
      where: {
        companies: {
          equals: companyId,
        },
      },
      select: {
        msdsName: true,
        publishedAt: true,
        filename: true,
        url: true,
      },
    })

    msdsContent = msdsResponse.docs as any
  } catch (error) {
    msdsContent = null
    console.error('DashboardPage error: ', error)
  }

  return <DashboardClient serverData={{ msdsContent }} />
}
