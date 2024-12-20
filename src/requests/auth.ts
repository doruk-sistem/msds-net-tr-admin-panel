import api from '@/utilities/api'
import { DataFromCollectionSlug } from 'payload'

type UpdateUser = {
  id: string | number
  body: Partial<DataFromCollectionSlug<'companyUsers'>>
}

const auth = {
  updateUser: async ({ body, id }: UpdateUser): Promise<DataFromCollectionSlug<'companyUsers'>> => {
    const url = `/update-user/${id}`

    const response = await api.patch(url, body)

    return response.data
  },
}

export default auth
