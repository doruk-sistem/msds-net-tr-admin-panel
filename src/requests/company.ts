import api from '@/utilities/api'
import { DataFromCollectionSlug } from 'payload'

type UpdateCompany = {
  accessToken: string
  id: string | number
  body: Partial<DataFromCollectionSlug<'companies'>>
}

const company = {
  updateCompany: async ({
    accessToken,
    body,
    id,
  }: UpdateCompany): Promise<DataFromCollectionSlug<'companyUsers'>> => {
    const url = `/update-company/${id}`

    const response = await api.patch(url, body, {
      headers: {
        Authorization: accessToken,
      },
    })

    return response.data
  },
}

export default company
