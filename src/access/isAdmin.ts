import { checkRole } from '@/collections/AdminUsers/checkRole'

export const isAdmin = ({ req: { user } }: any) => {
  return checkRole(['admin'], user)
}
