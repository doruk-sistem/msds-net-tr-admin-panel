import path from 'path'
import { fileURLToPath } from 'url'

import { CollectionConfig } from 'payload'
import slugify from 'slugify'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

import { processPDF } from '@/utilities/openai'

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
  fields: [
    {
      name: 'preparation_date',
      label: {
        tr: 'Hazırlama Tarihi',
        en: 'Preparation Date',
      },
      type: 'text',
      admin: {
        description: {
          tr: 'Döküman kaydedildikten sonra otomatik tanımlanır. (Ai scanning & filling)',
          en: 'Fills the document automaticlly after saving. (Ai scanning & filling)',
        },
        readOnly: true,
      },
    },
    {
      name: 'form_no',
      label: {
        tr: 'Form No.',
        en: 'Form No.',
      },
      type: 'text',
      admin: {
        description: {
          tr: 'Döküman kaydedildikten sonra otomatik tanımlanır. (Ai scanning & filling)',
          en: 'Fills the document automaticlly after saving. (Ai scanning & filling)',
        },
        readOnly: true,
      },
    },
    {
      name: 'new_regulation_date',
      label: {
        tr: 'Yeni Düzenleme Tarihi',
        en: 'New Regulation Date',
      },
      type: 'text',
      admin: {
        description: {
          tr: 'Döküman kaydedildikten sonra otomatik tanımlanır. (Ai scanning & filling)',
          en: 'Fills the document automaticlly after saving. (Ai scanning & filling)',
        },
        readOnly: true,
      },
    },
    {
      name: 'how_many_regulations',
      label: {
        tr: 'Düzenlenme Sayısı',
        en: 'How Many Regulations',
      },
      type: 'text',
      admin: {
        description: {
          tr: 'Döküman kaydedildikten sonra otomatik tanımlanır. (Ai scanning & filling)',
          en: 'Fills the document automaticlly after saving. (Ai scanning & filling)',
        },
        readOnly: true,
      },
    },
  ],
  upload: {
    // Upload to the public/msds directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../assets/msdsFiles'),
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
      async ({ req, operation, data }) => {
        if ((operation === 'create' || operation === 'update') && req.file?.data) {
          const result = await processPDF(
            req.file?.data,
            `PDF dosyasının içindeki "Hazırlama Tarihi", "Form No.", "Yeni Düzenleme Tarihi" ve "Kaçıncı düzenleme olduğu" verilerini bul ve bunları bir json nesnesi olarak ver.
          Belirttiğim veriler farklı dillerde de yazılmış olabilir.
          Hangi dilde ise o dile uygun formatta verileri getir.
          Ancak bana vereceğim json objesindeki key isimleri her zaman ingilizce olsun. Key'leri şu şekilde ayarlayabilirsin:
          "Hazırlama Tarihi" için: "preparation_date" 
          "Form No." için: "form_no" 
          "Yeni Düzenleme Tarihi" için: "new_regulation_date" 
          "Kaçıncı düzenleme olduğu" için: "how_many_regulations" 
          `,
          )

          if (typeof result === 'string') {
            const jsonString = result.replace(/```json|```/g, '').trim()

            const jsonObject = JSON.parse(jsonString)

            return {
              ...data,
              preparation_date: jsonObject?.preparation_date,
              form_no: jsonObject?.form_no,
              new_regulation_date: jsonObject?.new_regulation_date,
              how_many_regulations: jsonObject?.how_many_regulations,
            }
          }
        }

        return data
      },
    ],
  },
}

export default MsdsDocs
