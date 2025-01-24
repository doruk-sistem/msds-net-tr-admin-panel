import path from 'path'
import { fileURLToPath } from 'url'

import { CollectionConfig } from 'payload'
import slugify from 'slugify'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

import { processPDF } from '@/utilities/openai'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MsdsStorage: CollectionConfig = {
  slug: 'msdsStorage',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    plural: 'MSDS Storage',
    singular: 'MSDS File',
  },
  fields: [
    {
      name: 'version',
      type: 'text',
    },
    // {
    //   name: 'msds',
    //   type: 'join',
    //   collection: 'msdsV2',
    //   on: 'versions',
    // },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../assets/msdsStorage'),
    bulkUpload: true,
    mimeTypes: ['application/pdf'],
  },
}

export default MsdsStorage
