import 'server-only'

import getPayloadCMS from './getPayloadCMS'
import authHelper from './authHelper'

export default async function getMe() {
  const session = await authHelper.getSession()
  const payload = await getPayloadCMS()

  if (session?.userId) {
    try {
      const user = await payload.findByID({
        id: session.userId,
        collection: 'companyUsers',
        depth: 0,
      })

      if ('apiKey' in user) delete user.apiKey
      if ('hashedPassword' in user) delete user.hashedPassword

      return user
    } catch {
      return null
    }
  }

  return null
}
