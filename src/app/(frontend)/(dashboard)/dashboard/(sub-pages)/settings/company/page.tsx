import getAuthSession from '@/utilities/getAuthSession'

import CompanySettingsPageClient from './page.client'
import { DataFromCollectionSlug } from 'payload'
import getPayloadCMS from '@/utilities/getPayloadCMS'

export default async function ProfileSettingsPage() {
  let company: DataFromCollectionSlug<'companies'> | undefined = undefined

  try {
    const payload = await getPayloadCMS()
    const session = await getAuthSession()

    company =
      typeof session?.user.company === 'number'
        ? await payload.findByID({
            collection: 'companies',
            id: session?.user.company,
            depth: 0,
          })
        : undefined
  } catch {
    company = undefined
  }

  return <CompanySettingsPageClient serverData={{ company }} />
}
