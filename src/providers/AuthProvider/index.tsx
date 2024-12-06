import { Company } from '@/payload-types'
import { type PaginatedDocs } from 'payload'

import getAuthSession from '@/utilities/getAuthSession'
import getPayloadCMS from '@/utilities/getPayloadCMS'

import AuthProviderClient from './AuthProviderClient'
import { Session } from 'next-auth'

export default async function AuthProvider({ children }: { children: React.ReactNode }) {
  let userCompany: PaginatedDocs<Company>['docs'][0] | null = null
  let session: Session | null = null

  try {
    session = await getAuthSession()
    const payload = await getPayloadCMS()

    if (session?.user?.company) {
      const companyResponse = await payload.find({
        collection: 'companies',
        limit: 1,
        depth: 0,
        where: {
          id: {
            equals: session?.user?.company,
          },
        },
      })

      userCompany = companyResponse.docs[0]
    }
  } catch (error) {
    console.log('AuthProviderError: ', error)
  }

  return (
    <AuthProviderClient serverSideData={{ userCompany }} session={session}>
      {children}
    </AuthProviderClient>
  )
}
