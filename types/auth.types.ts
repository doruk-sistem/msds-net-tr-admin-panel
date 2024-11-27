import { Result as LoginResult } from 'node_modules/payload/dist/auth/operations/login'
import { DataFromCollectionSlug } from 'payload'

export type ClientUser = Omit<LoginResult, 'user'> & {
  user: DataFromCollectionSlug<'companyUsers'>
}
