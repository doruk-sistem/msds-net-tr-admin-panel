import 'server-only'

import { getServerSession, Session } from 'next-auth'
import authOptions from '@/app/(payload)/api/auth/[...nextauth]/authOptions'

export default async function getAuthSession() {
  const session = await getServerSession(authOptions)

  return session
}
