import { DataFromCollectionSlug } from 'payload'

export type AuthError = 'RefreshTokenExpired' | 'TokenExpired' | 'RefreshTokenError'

export type ClientUser = {
  user: DataFromCollectionSlug<'companyUsers'>
  auth: {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    refreshTokenExpires: number
  }
}
