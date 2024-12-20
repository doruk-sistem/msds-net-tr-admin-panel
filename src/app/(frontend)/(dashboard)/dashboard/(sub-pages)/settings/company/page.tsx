import { DataFromCollectionSlug } from 'payload'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import getMe from '@/utilities/getMe'

import CompanySettingsPageClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function ProfileSettingsPage() {
  let company: DataFromCollectionSlug<'companies'> | undefined = undefined

  try {
    const payload = await getPayloadCMS()
    const user = await getMe()

    company =
      typeof user?.company === 'number'
        ? await payload.findByID({
            collection: 'companies',
            id: user.company,
            depth: 0,
          })
        : undefined
  } catch {
    company = undefined
  }

  return <CompanySettingsPageClient serverData={{ company }} />
}
