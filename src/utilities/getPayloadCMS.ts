import { getPayload } from 'payload'
import config from '@payload-config'

export default async function getPayloadCMS() {
  const payload = await getPayload({ config })

  return payload
}
