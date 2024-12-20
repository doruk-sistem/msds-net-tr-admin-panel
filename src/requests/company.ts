import api from '@/utilities/api'
import { DataFromCollectionSlug } from 'payload'

type UpdateCompany = {
  id: string | number
  body: Partial<DataFromCollectionSlug<'companies'>>
}

const company = {
  updateCompany: async ({
    body,
    id,
  }: UpdateCompany): Promise<DataFromCollectionSlug<'companyUsers'>> => {
    const url = `/update-company/${id}`

    const response = await api.patch(url, body)

    return response.data
  },
}

export default company
