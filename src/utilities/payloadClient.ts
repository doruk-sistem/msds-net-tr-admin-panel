import axios from 'axios'
import { DataFromCollectionSlug, type CollectionSlug, type Where } from 'payload'
import qs from 'qs'

import CompanyUsers from '@/collections/CompanyUsers'

const stringifiedQuery = (query: any) => qs.stringify(query, { addQueryPrefix: true })

type FindById<Collection extends CollectionSlug> = {
  collection: Collection
  id: string
  token: string
}

type Find<Collection extends CollectionSlug> = {
  collection: Collection
  token: string
}

type Update<Collection extends CollectionSlug> = {
  collection: Collection
  token: string
  where: Where
  body: Partial<DataFromCollectionSlug<Collection>>
}

type UpdateById<Collection extends CollectionSlug> = {
  collection: Collection
  token: string
  id: string | number
  body: Partial<DataFromCollectionSlug<Collection>>
}

/**
 * If you want to use payload functions, use it
 *
 * This logic is an alternative getPayload function for client side
 *
 * **Client side api operations**:
 * @see https://payloadcms.com/docs/rest-api/overview#collections
 */
const payloadClient = {
  find: async <Collection extends CollectionSlug>({ collection, token }: Find<Collection>) => {
    const url = `/api/${collection}/`

    const response = await axios.get(url, {
      headers: {
        Authorization: `${CompanyUsers.slug} API-Key ${token}`,
      },
    })

    return response.data
  },
  findById: async <Collection extends CollectionSlug>({
    collection,
    token,
    id,
  }: FindById<Collection>) => {
    const url = `/api/${collection}/${id}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `${CompanyUsers.slug} API-Key ${token}`,
      },
    })

    return response.data
  },
  update: async <Collection extends CollectionSlug>({
    collection,
    token,
    where,
    body,
  }: Update<Collection>) => {
    const url = `/api/${collection}/${where ? stringifiedQuery({ where }) : ''}`

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `${CompanyUsers.slug} API-Key ${token}`,
      },
    })

    return response.data
  },
  updateById: async <Collection extends CollectionSlug>({
    collection,
    token,
    body,
    id,
  }: UpdateById<Collection>): Promise<{
    message: string
    doc: DataFromCollectionSlug<Collection>
  }> => {
    const url = `/api/${collection}/${id}`

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `${CompanyUsers.slug} API-Key ${token}`,
      },
    })

    return response.data
  },
}

export default payloadClient
