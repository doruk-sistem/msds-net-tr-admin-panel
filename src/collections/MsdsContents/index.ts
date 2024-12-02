import { CollectionConfig, ValidationError } from 'payload'
import slugify from 'slugify'
import locale from 'locale-codes'

import type { MsdsContent } from '@/payload-types'

import { populatePublishedAt } from '@/hooks/populatePublishedAt'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

const localeOptions = locale.all.map((item) => ({
  label: `${item.tag} (${item.name} - ${item.location})`,
  value: item.tag,
}))

const MsdsContents: CollectionConfig = {
  slug: 'msdsContents',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'company', 'publishedAt'],
    useAsTitle: 'name',
    listSearchableFields: ['name'],
  },
  labels: {
    plural: {
      tr: 'MSDS Kayıtları',
      en: 'MSDS Contents',
    },
    singular: {
      tr: 'MSDS Kaydı',
      en: 'MSDS Content',
    },
  },
  fields: [
    {
      name: 'name',
      label: {
        tr: 'MSDS İsmi',
        en: 'MSDS Name',
      },
      type: 'text',
      required: true,
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
      name: 'msdsContent',
      label: {
        tr: 'MSDS İçerikleri',
        en: 'MSDS Contents',
      },
      admin: {
        description: {
          tr: 'Her bir dil seçeneği için ayrı MSDS içeriği ekleyebilirsiniz.',
          en: 'You can add MSDS content for each language option.',
        },
      },
      required: true,
      type: 'array',
      fields: [
        {
          name: 'msdsFile',
          type: 'upload',
          relationTo: 'msdsDocs',
        },
        {
          name: 'msdsLanguage',
          label: {
            tr: 'İçerik Dili',
            en: 'Content Language',
          },
          type: 'select',
          options: localeOptions,
          required: true,
        },
        {
          name: 'msdsName',
          type: 'text',
          label: {
            tr: 'İçerik İsmi ya da Kodu',
            en: 'Content Name or Code',
          },
          admin: {
            description: {
              tr: 'Bu içeriğe özgü bir tanım giriniz.',
              en: 'You enter a unique name/code for this content.',
            },
          },
          required: true,
        },
        {
          name: 'msdsUniuqeId',
          type: 'text',
          admin: {
            readOnly: true,
            description: {
              tr: "Eklediğiniz MSDS içeriği için oluşturulan benzersiz bir id'dir. Şu kombinasyonlara göre oluşur: {msdsCompanyName}-{msdsId}-{msdsName}-{msdsContentId}-{msdsContentName}-{msdsContentLanguage}. Bunlardan herhangi biri değiştiği taktirde id güncellenecektir.",
              en: 'It is a unique id generated for the MSDS content you add. It is created according to these combinations: {msdsCompanyName}-{msdsId}-{msdsName}-{msdsContentId}-{msdsContentName}-{msdsContentLanguage}. If any of these changes, the id will be updated.',
            },
          },
          hooks: {
            afterRead: [
              async ({ siblingData, originalDoc, req }) => {
                const company = await req.payload.findByID({
                  id: originalDoc?.company,
                  collection: 'companies',
                  depth: 0,
                })

                const originalMsdsContentCompany = slugify(company.companyName, { strict: true })
                const originalMsdsContentId = originalDoc?.id
                const originalMsdsContentName = slugify(originalDoc?.name, { strict: true })
                const msdsItemId = siblingData?.id
                const msdsItemName = slugify(siblingData?.msdsName, { strict: true })
                const msdsItemLanguage = siblingData?.msdsLanguage

                return `${originalMsdsContentCompany}-${originalMsdsContentId}-${originalMsdsContentName}-${msdsItemId}-${msdsItemName}-${msdsItemLanguage}`
              },
            ],
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      label: {
        tr: 'Şu tarihte yayınlandı',
        en: 'Published at',
      },
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
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
          tr: 'İçeriğin şu anda görüntülenip görüntülenemeyeceğini belirleyin.',
          en: 'Determine whether the content can currently be displayed.',
        },
      },
      defaultValue: true,
      type: 'checkbox',
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    beforeValidate: [
      ({ data }) => {
        const msdsContent = data?.msdsContent as MsdsContent['msdsContent']

        const duplicates = msdsContent.reduce(
          (_values, currentValue) => {
            const values = _values as unknown as {
              data: MsdsContent['msdsContent']
              hasDuplicate: boolean
            }

            if (!values.hasDuplicate) {
              values.hasDuplicate = values.data.some(
                (item) => item.msdsLanguage === currentValue.msdsLanguage,
              )
            }

            values.data.push(currentValue)

            return values
          },
          { data: [], hasDuplicate: false },
        )

        if (duplicates.hasDuplicate) {
          throw new ValidationError({
            errors: [
              {
                message: 'Error',
                path: 'There were/was duplicate language content in MSDS contents!',
              },
            ],
          })
        }
      },
    ],
  },
}

export default MsdsContents
