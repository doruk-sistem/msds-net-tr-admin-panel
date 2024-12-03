import path from 'path'
import { fileURLToPath } from 'url'

import { CollectionConfig } from 'payload'
import slugify from 'slugify'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MsdsDocs: CollectionConfig = {
  slug: 'msdsDocs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    plural: {
      tr: 'MSDS Dosyaları',
      en: 'MSDS Files',
    },
    singular: {
      tr: 'MSDS Dosyası',
      en: 'MSDS File',
    },
  },
  fields: [],
  upload: {
    // Upload to the public/msds directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../assets/msdsFiles'),
    bulkUpload: true,
    mimeTypes: ['application/pdf'],
  },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const fileNameValue = slugify(
            req.file.name.slice(0, req.file.name.lastIndexOf('.pdf')).trim(),
            { strict: true },
          )

          req.file.name = `${fileNameValue}.pdf`
        }
      },
    ],
  },
}

export default MsdsDocs
