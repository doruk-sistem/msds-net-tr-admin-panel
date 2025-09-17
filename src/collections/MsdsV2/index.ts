import path from 'path'
import { fileURLToPath } from 'url'

import { CollectionConfig } from 'payload'
import slugify from 'slugify'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

import { aiScanning } from './hooks/aiScanning'
import { generateMsdsUniqueId } from './hooks/generateMsdsUniqueId'
import QRCodeComponent from './components/QRCodeComponent'
import QRCodeCell from './components/QRCodeCell'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MsdsV2: CollectionConfig = {
  slug: 'msdsV2',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: {
      tr: 'MSDS içeriklerini yönetmek için burayı kullanınız. "MSDS Dosyaları" ve "MSDS Kayıtları" yakın zamanda kullanımdan kaldırılacaktır. Onun yerine MSDS v2 kullanınız.',
      en: 'Use this to manage MSDS contents. "MSDS Files" and "MSDS Records" will be deprecated soon. Use MSDS v2 instead.',
    },
  },
  labels: {
    plural: {
      tr: 'MSDS v2',
      en: 'MSDS v2',
    },
    singular: {
      tr: 'MSDS v2',
      en: 'MSDS v2',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
      admin: {
        description: {
          tr: 'Doldurulmassa yüklediğiniz dosyanın adını alır.',
          en: 'If not filled, it takes the name of the uploaded file.',
        },
      },
      hooks: {
        beforeChange: [
          ({ value, operation, siblingData }) => {
            if ((operation === 'create' || operation === 'update') && !value) {
              const filename = siblingData?.filename
                ? siblingData?.filename.slice(0, siblingData?.filename.lastIndexOf('.pdf')).trim()
                : 'unnamed'

              const originalMsdsContentName = slugify(filename, { strict: true })

              return originalMsdsContentName
            }

            return value
          },
        ],
      },
    },
    {
      name: 'uniqueId',
      type: 'text',
      unique: true,
      hooks: {
        afterRead: [generateMsdsUniqueId],
      },
      admin: {
        readOnly: true,
        description: {
          tr: 'Döküman kaydedildikten sonra otomatik olarak tanımlanır. (Şu şekilde tanımlanır: {company}-{name}-{id}-{contentLanguage})',
          en: 'Automatically generated after saving the document. (It is defined as: {company}-{name}-{id}-{contentLanguage})',
        },
      },
    },
    {
      name: 'company',
      label: {
        tr: 'Şirket',
        en: 'Company',
      },
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'isPublished',
      label: {
        tr: 'Yayında',
        en: 'Published',
      },
      admin: {
        position: 'sidebar',
        description: {
          tr: 'İçeriğin şu anda müşteriye görünüp görünmeyeceğini belirleyin.',
          en: 'Determine whether the content can currently be displayed to the customer.',
        },
      },
      defaultValue: true,
      type: 'checkbox',
    },
    {
      name: 'qrCode',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: 'src/collections/MsdsV2/components/QRCodeComponent',
          Cell: 'src/collections/MsdsV2/components/QRCodeCell',
        },
      },
    },
    {
      type: 'collapsible',
      label: {
        tr: 'Diğer Bilgiler',
        en: 'Other Information',
      },
      fields: [
        {
          name: 'id',
          type: 'number',
          required: true,
          unique: true,
          admin: {
            readOnly: true,
            position: 'sidebar',
          },
        },
        {
          name: 'aiScanning',
          type: 'checkbox',
          defaultValue: true,
          label: {
            tr: 'Ai Taramasıyla Otomatik Doldur',
            en: 'Fill Automatically with Ai Scanning',
          },

          admin: {
            description: {
              tr: 'Doldurulmayan alanlar varsa bu alanları pdf dosyasından okuyup otomatik olarak doldur.',
              en: 'If there are fields that are not filled, it will read them from the pdf file and fill them automatically.',
            },
          },
        },
        {
          name: 'msdsCreatedAt',

          label: {
            tr: 'Hazırlama Tarihi',
            en: 'Preparation Date',
          },
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },

        {
          name: 'formNo',
          label: {
            tr: 'Form No.',
            en: 'Form No.',
          },
          type: 'text',
        },
        {
          name: 'msdsUpdatedAt',
          label: {
            tr: 'Yeniden Düzenleme Tarihi',
            en: 'New Regulation Date',
          },
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'updatedCount',
          label: {
            tr: 'Düzenlenme Sayısı',
            en: 'How Many Regulations',
          },
          type: 'number',
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'author',
          label: {
            tr: 'Kimyasal Değerlendirme Uzmanı',
            en: 'Chemical Evaluation Expert',
          },
          type: 'text',
        },
        {
          name: 'certificateDate',

          label: {
            tr: 'Sertifika Tarihi',
            en: 'Certificate Date',
          },
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'expiryDate',
          label: {
            tr: 'Geçerlilik Tarihi',
            en: 'Expiry Date',
          },
          type: 'date',
          admin: {
            description: {
              tr: 'MSDS belgesinin geçerlilik süresi sonu (Sertifika tarihinden 5 yıl sonra)',
              en: 'End of validity period for MSDS document (5 years after certificate date)',
            },
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy',
            },
          },
          hooks: {
            beforeChange: [
              ({ value, data }) => {
                if (!value && data?.certificateDate) {
                  const certDate = new Date(data.certificateDate)
                  certDate.setFullYear(certDate.getFullYear() + 5)
                  return certDate.toISOString()
                }
                return value
              },
            ],
          },
        },
        {
          name: 'contentLanguage',
          label: {
            tr: 'İçerik Dili',
            en: 'Content Language',
          },
          type: 'relationship',
          relationTo: 'contentLanguages',
        },
      ],
    },
  ],
  upload: {
    // Upload to the public/msds directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../files/msdsFiles'),
    bulkUpload: true,
    mimeTypes: ['application/pdf'],
  },
  hooks: {
    beforeOperation: [
      async ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const fileNameValue = slugify(
            req.file.name.slice(0, req.file.name.lastIndexOf('.pdf')).trim(),
            { strict: true },
          )

          req.file.name = `${fileNameValue}.pdf`
        }
      },
    ],
    beforeChange: [
      aiScanning,
      async ({ req, data }) => {
        if (!data.id) {
          const lastDoc = await req.payload.find({
            collection: 'msdsV2',
            sort: '-id',
            limit: 1,
          })
          data.id = (lastDoc.docs[0]?.id || 0) + 1
        }
        delete data.qrCode
        return data
      },
    ],
  },
}

export default MsdsV2
