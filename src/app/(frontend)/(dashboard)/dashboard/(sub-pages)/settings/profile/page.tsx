import ProfileSettingsPageClient from './page.client'
import getMe from '@/utilities/getMe'

export const dynamic = 'force-dynamic'

export default async function ProfileSettingsPage() {
  let user: Awaited<ReturnType<typeof getMe>> = null

  try {
    user = await getMe()
  } catch {
    user = null
  }

  return <ProfileSettingsPageClient serverData={{ user }} />
}
