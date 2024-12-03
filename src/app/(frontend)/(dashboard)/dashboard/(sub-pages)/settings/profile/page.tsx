import { ClientUser } from 'types/auth.types'

import getAuthSession from '@/utilities/getAuthSession'

import SettingsPageClient from './page.client'

export default async function SettingsPage() {
  let user: ClientUser['user'] | undefined = undefined

  try {
    const session = await getAuthSession()

    user = session?.user
  } catch {
    user = undefined
  }

  return <SettingsPageClient serverData={{ user }} />
}
