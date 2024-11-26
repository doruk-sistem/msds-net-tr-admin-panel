import path from 'path'
import { fileURLToPath } from 'url'

import { CollectionConfig } from 'payload'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MSDS: CollectionConfig = {
  slug: 'msds',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: {
      tr: 'Lütfen yüklediğiniz dosya isimlerinde BOŞLUK ve ÖZEL KARAKTER (örn Türkçe harfler) kullanmayınız. Aksi taktirde hatalar ile karşılaşabilirsiniz.',
      en: 'Please do not use SPACE and SPECIAL CHARACTER (e.g. Turkish letters) in you file names you upload. If you do it, you may encounter errors',
    },
    defaultColumns: ['msdsName', 'publishedAt'],
    useAsTitle: 'msdsName',
  },
  labels: {
    plural: {
      tr: "MSDS'ler",
      en: 'MSDS',
    },
    singular: {
      tr: 'MSDS',
      en: 'MSDS',
    },
  },
  fields: [
    {
      name: 'msdsName',
      label: {
        tr: 'MSDS İsmi',
        en: 'MSDS Name',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'companies',
      label: {
        tr: 'Bağlı Şirketler',
        en: 'Companies',
      },
      type: 'relationship',
      relationTo: 'companies',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  upload: {
    // Upload to the public/msds directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../../public/msds'),
    bulkUpload: true,
    mimeTypes: ['application/pdf'],
  },
  hooks: {
    beforeChange: [populatePublishedAt],
  },
}

export default MSDS
