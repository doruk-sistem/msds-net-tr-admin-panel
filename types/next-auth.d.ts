import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

import { LoginResponse } from '@/utilities/login'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: LoginResponse['user']
    token: LoginResponse['token']
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    exp: LoginResponse['exp']
    token: LoginResponse['token']
    user: LoginResponse['user']
    error?: NextAuthSession['error']
  }
}
