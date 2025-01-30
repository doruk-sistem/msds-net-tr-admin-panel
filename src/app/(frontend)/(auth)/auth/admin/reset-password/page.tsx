import { notFound } from 'next/navigation'

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

  return <ResetPasswordPageClient />
}
