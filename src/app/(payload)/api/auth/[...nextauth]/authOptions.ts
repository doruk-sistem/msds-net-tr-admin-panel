import bcrypt from 'bcryptjs'
import { type JWT } from 'next-auth/jwt'
import { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { ClientUser } from 'types/auth.types'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import { signJWT, verifyJWT } from '@/utilities/jwt'

import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, `../../../../../../.env.${process.env.NODE_ENV}`),
})

// const ACCESS_TOKEN_EXPIRES_IN = 15 * 60 * 1000 // 15 minutes
const ACCESS_TOKEN_EXPIRES_IN = 120 * 60 * 1000 // 2 hours
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000 // 7 days
// const ACCESS_TOKEN_EXPIRES_IN_STR = '15m'
const ACCESS_TOKEN_EXPIRES_IN_STR = '2h'
const REFRESH_TOKEN_EXPIRES_IN_STR = '7d'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email
        const password = credentials?.password

        try {
          if (!email && !password) {
            return null
          }

          const payload = await getPayloadCMS()

          const users = await payload.find({
            depth: 0,
            collection: 'companyUsers',
            where: {
              email: {
                equals: email,
              },
            },
          })

          const user = users?.docs[0]

          if (!user) {
            return null
          }

          const isValid =
            password && user.hashedPassword
              ? await bcrypt.compare(password, user.hashedPassword)
              : false

          if (!isValid) {
            return null
          }

          return user as any
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
      const authorizeData: ClientUser['user'] = user as any

      // First-time login, store tokens
      if (authorizeData) {
        const accessToken = signJWT(
          { apiKey: authorizeData.apiKey },
          {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN_STR,
          },
        )
        const refreshToken = signJWT(
          { apiKey: authorizeData.apiKey },
          {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN_STR,
          },
        )
        const accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN
        const refreshTokenExpires = Date.now() + REFRESH_TOKEN_EXPIRES_IN

        return {
          user: authorizeData,
          auth: {
            accessToken,
            refreshToken,
            accessTokenExpires,
            refreshTokenExpires,
          },
        }
      }

      // If refresh token is expired, refresh it
      if (Date.now() > token.auth.refreshTokenExpires) {
        console.log('--------------- RefreshTokenExpired --------------- ')
        return { ...token, error: 'RefreshTokenExpired' } // Refresh token süresi dolmuş
      }

      // If access token is expired, refresh it
      if (Date.now() > token.auth.accessTokenExpires) {
        const newToken = refreshAccessToken(token)
        return newToken
      }

      if (trigger === 'update') {
        if (session) {
          if ('user' in session && typeof session.user === 'object') {
            token.user = {
              ...token.user,
              ...session.user,
            }
          }

          if ('error' in session) {
            token.error = session?.error
          }
        }
      }

      return token
    },
    // Session callback to pass token to session
    session: ({ token, session }) => {
      const data = structuredClone(token)

      delete data.user.hashedPassword
      delete data.user.apiKey
      delete data.user.enableAPIKey

      session.auth = data.auth
      session.user = data.user
      session.error = data.error

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

function refreshAccessToken(token: JWT): JWT {
  try {
    const decoded = verifyJWT(token.auth.refreshToken) as any

    const accessToken = signJWT(
      { apiKey: decoded.apiKey },
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN_STR,
      },
    )

    const refreshToken = signJWT(
      { apiKey: decoded.apiKey },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN_STR,
      },
    )

    console.log('--------------- token has been refreshed ---------------')
    return {
      ...token,
      auth: {
        refreshToken,
        accessToken,
        accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpires: Date.now() + REFRESH_TOKEN_EXPIRES_IN,
      },
      error: undefined,
    }
  } catch (error) {
    console.error('Refresh token error:', error)
    return { ...token, error: 'RefreshTokenError' }
  }
}

export default authOptions
