import api from '@/utilities/api'
import { DataFromCollectionSlug } from 'payload'

type UpdateUser = {
  accessToken: string
  id: string | number
  body: Partial<DataFromCollectionSlug<'companyUsers'>>
}

const auth = {
  updateUser: async ({
    accessToken,
    body,
    id,
  }: UpdateUser): Promise<DataFromCollectionSlug<'companyUsers'>> => {
    const url = `/update-user/${id}`

    const response = await api.patch(url, body, {
      headers: {
        Authorization: accessToken,
      },
    })

    return response.data
  },
}

export default auth
