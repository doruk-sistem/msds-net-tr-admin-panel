import { notFound } from 'next/navigation'
import jwt from 'jsonwebtoken'

import ResetPasswordPageClient from './page.client'

export default async function ResetPasswordPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const searchParams = await searchParamsPromise

  const token = searchParams.token

  if (!token) {
    notFound()
  }

  let decoded: any = null

  try {
    decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!)
  } catch {
    decoded = null
  }

  return <ResetPasswordPageClient hasExpired={!decoded} />
}
