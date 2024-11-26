import 'server-only'

import { getServerSession, Session } from 'next-auth'
import authOptions from '@/app/(payload)/api/auth/[...nextauth]/authOptions'

export default async function getAuthSession(): Promise<Session | null> {
  let session: Session | null = null

  try {
    session = await getServerSession(authOptions)
  } catch {
    session = null
  }

  return session
}
