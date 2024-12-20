import { Company } from '@/payload-types'
import { type PaginatedDocs } from 'payload'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import authHelper from '@/utilities/authHelper'
import getMe from '@/utilities/getMe'

import { AuthInit } from './AuthProviderClient'

export default async function AuthProvider({ children }: { children: React.ReactNode }) {
  let userCompany: PaginatedDocs<Company>['docs'][0] | null = null
  let user: Awaited<ReturnType<typeof getMe>> = null
  let tokens: Awaited<ReturnType<typeof authHelper.getTokens>> = {
    accessToken: undefined,
    refreshToken: undefined,
  }

  try {
    tokens = await authHelper.getTokens()
    user = await getMe()
    const payload = await getPayloadCMS()

    if (user && user?.company) {
      const companyResponse = await payload.find({
        collection: 'companies',
        limit: 1,
        depth: 0,
        where: {
          id: {
            equals: user?.company,
          },
        },
      })

      userCompany = companyResponse.docs[0]
    }
  } catch (error) {
    console.log('AuthProviderError: ', error)
  }

  return <AuthInit serverSideData={{ userCompany, user, tokens }}>{children}</AuthInit>
}
