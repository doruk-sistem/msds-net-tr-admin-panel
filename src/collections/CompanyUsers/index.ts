import type { CollectionConfig } from 'payload'

import bcrypt from 'bcryptjs'

import { authenticated } from '../../access/authenticated'
import generateRandomPassword from '@/utilities/generatePassword'

const CompanyUsers: CollectionConfig = {
  slug: 'companyUsers',
  labels: {
    plural: {
      tr: 'Şirket Kullanıcıları',
      en: 'Company Users',
    },
    singular: {
      tr: 'Şirket Kullanıcısı',
      en: 'Company User',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['fullname', 'email', 'personalPhoneNumber', 'company'],
    useAsTitle: 'fullname',
    listSearchableFields: ['fullname', 'email'],
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  fields: [
    {
      name: 'description',
      type: 'ui',
      admin: {
        components: {
          Field: 'src/collections/CompanyUsers/components/Description',
        },
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'hashedPassword',
      label: {
        tr: 'Parola',
        en: 'Password',
      },
      type: 'text',
      admin: {
        components: {
          Field: 'src/collections/CompanyUsers/components/HashedPassword',
        },
      },
      hooks: {
        beforeValidate: [
          async ({ value, operation, originalDoc, req, data }) => {
            if (req.payloadAPI === 'local' && operation === 'update') {
              return originalDoc?.hashedPassword
            }

            if (operation === 'create' || operation === 'update') {
              try {
                const isSameValue = originalDoc?.hashedPassword === value

                if (operation === 'update' && isSameValue) return value

                const newPassword = !value ? generateRandomPassword() : value

                const hashedPassword = await bcrypt.hash(newPassword, 10)

                return hashedPassword
              } catch (error) {
                console.error('hashedPassword field error: ', error)
                throw new Error(error)
              }
            }

            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            tr: 'Genel Bilgiler',
            en: 'General Information',
          },
          fields: [
            {
              name: 'fullname',
              label: {
                tr: 'İsim-Soyisim',
                en: 'Fullname',
              },
              type: 'text',
              required: true,
            },
            {
              name: 'personalPhoneNumber',
              label: {
                tr: 'Kişisel Telefon Numarası',
                en: 'Personal Phone Number',
              },
              type: 'text',
              required: true,
            },
            {
              name: 'position',
              label: {
                tr: 'Pozisyon',
                en: 'Position',
              },
              type: 'text',
            },
            {
              name: 'company',
              label: {
                tr: 'Bağlı Olduğu Şirket',
                en: 'User Company',
              },
              type: 'relationship',
              relationTo: 'companies',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data?.enableAPIKey) {
          return {
            ...data,
            enableAPIKey: true,
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}

export default CompanyUsers
