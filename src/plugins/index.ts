import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const plugins: any = []

if (process.env.BLOB_READ_WRITE_TOKEN) {
  const vercelBlob = vercelBlobStorage({
    collections: {
      msdsV2: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  })

  plugins.push(vercelBlob)
}

export default plugins
