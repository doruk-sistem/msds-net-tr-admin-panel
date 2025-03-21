import path from 'path'
import { fileURLToPath } from 'url'
import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { sendNotifications } from './hooks/sendNotifications'
import { put } from '@vercel/blob' // import değişti
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MsdsRequestsV2: CollectionConfig = {
  slug: 'msdsRequestsV2',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'company', 'status', 'createdAt'],
    description: {
      tr: 'MSDS taleplerini yönetmek için kullanılır.',
      en: 'Used to manage MSDS requests.',
    },
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
      label: {
        tr: 'Ürün Adı',
        en: 'Product Name',
      },
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: {
        tr: 'Şirket',
        en: 'Company',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: {
            tr: 'Beklemede',
            en: 'Pending',
          },
          value: 'pending',
        },
        {
          label: {
            tr: 'İşleme Alındı',
            en: 'In Progress',
          },
          value: 'inProgress',
        },
        {
          label: {
            tr: 'Tamamlandı',
            en: 'Completed',
          },
          value: 'completed',
        },
      ],
    },
    {
      name: 'requestedBy',
      type: 'relationship',
      relationTo: 'companyUsers',
      required: true,
      label: {
        tr: 'Talep Eden',
        en: 'Requested By',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        tr: 'Açıklama',
        en: 'Description',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../files/msdsFiles'),
    bulkUpload: true,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  hooks: {
    beforeOperation: [
      async ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const fileNameValue = slugify(
            req.file.name.slice(0, req.file.name.lastIndexOf('.')).trim(),
            { strict: true },
          )
          req.file.name = `${fileNameValue}${path.extname(req.file.name)}`
        }
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        if (data.responses?.length > 0) {
          const latestResponse = data.responses[data.responses.length - 1]
          if (!latestResponse.respondedBy && req.user) {
            latestResponse.respondedBy = req.user.id
            latestResponse.respondedAt = new Date().toISOString()
          }
        }
        return data
      },
    ],
    afterChange: [
      sendNotifications,
      async ({ doc, operation }) => {
        if ((operation === 'create' || operation === 'update') && doc.url) {
          try {
            // Dosyayı fetch et
            const fileResponse = await fetch(`http://localhost:3000${doc.url}`)
            const fileBlob = await fileResponse.blob()

            // Vercel Blob'a yükle
            const blob = await put(doc.filename, fileBlob, {
              access: 'public',
              token: process.env.BLOB_READ_WRITE_TOKEN, // NEXT_PUBLIC_ prefix'ini kaldırdık
            })
            console.log('File uploaded to Vercel Blob:', blob.url)
          } catch (error) {
            console.error('Vercel Blob upload error:', error)
            console.error('Error details:', error.message)
          }
        }
      },
    ],
  },
}

export default MsdsRequestsV2
