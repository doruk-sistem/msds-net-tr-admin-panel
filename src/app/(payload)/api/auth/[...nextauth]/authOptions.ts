import dotenv from 'dotenv'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import path from 'path'
import { fileURLToPath } from 'url'
import { ClientUser } from 'types/auth.types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
dotenv.config({
  path: path.resolve(dirname, `../../../../../../.env.${process.env.NODE_ENV}`),
})

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        authType: { label: 'Auth Type' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email && !credentials?.password) {
            return null
          }

          const payload = await getPayload({ config: configPromise })

          const loginResponse = await payload.login({
            collection: 'companyUsers',
            data: {
              email: credentials?.email,
              password: credentials?.password,
            },
            depth: 0,
          })

          if (loginResponse) {
            return loginResponse as any
          }

          return null
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      const authorizeData: ClientUser = user as any

      // First-time login, store tokens
      if (authorizeData) {
        token.exp = authorizeData.exp
        token.user = authorizeData.user
        token.token = authorizeData.token
      }

      // Access token expiration check and refresh logic
      const currentTime = Math.floor(Date.now() / 1000)

      if (trigger === 'update') {
        if (session) {
          if ('user' in session && typeof session.user === 'object') {
            token.user = {
              ...token.user,
              ...session.user,
            }
          }
        }
      }

      if (token?.exp && currentTime < token?.exp) {
        return token
      }

      return token
    },
    // Session callback to pass token to session
    session: ({ token, session }) => {
      session.token = token.token
      session.user = token.user
      session.error = token.error

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
