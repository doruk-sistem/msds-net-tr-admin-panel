import { ClientUser } from 'types/auth.types'

import getAuthSession from '@/utilities/getAuthSession'

import ProfileSettingsPageClient from './page.client'

export default async function ProfileSettingsPage() {
  let user: ClientUser['user'] | undefined = undefined

  try {
    const session = await getAuthSession()

    user = session?.user
  } catch {
    user = undefined
  }

  return <ProfileSettingsPageClient serverData={{ user }} />
}
