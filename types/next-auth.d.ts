import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { AuthError, ClientUser } from './auth.types'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ClientUser['user']
    auth: ClientUser['auth']
    error?: AuthError
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: ClientUser['user']
    auth: ClientUser['auth']
    error?: AuthError
  }
}
