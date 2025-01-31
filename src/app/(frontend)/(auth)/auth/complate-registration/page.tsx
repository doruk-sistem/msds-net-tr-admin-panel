import { notFound } from 'next/navigation'

import getPayloadCMS from '@/utilities/getPayloadCMS'

import ComplateRegistrationPageClient from './page.client'

export default async function ComplateRegistrationPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ email: string }>
}) {
  const searchParams = await searchParamsPromise

  const email = searchParams.email

  try {
    const payload = await getPayloadCMS()

    const users = await payload.find({
      collection: 'companyUsers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    const user = users?.docs && Array.isArray(users?.docs) ? users?.docs[0] : null

    if (!user || user.registrationCompleted) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  return <ComplateRegistrationPageClient />
}
