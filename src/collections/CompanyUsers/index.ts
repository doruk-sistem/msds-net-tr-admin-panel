import type { CollectionConfig } from 'payload'

import bcrypt from 'bcryptjs'

import generateRandomPassword from '@/utilities/generatePassword'
import { getServerSideURL } from '@/utilities/getURL'

import { authenticated } from '../../access/authenticated'

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
          async (params) => {
            const { value, operation, originalDoc, req, data } = params

            /**
             * This check is done to prevent the password from being randomly generated
             * during an update from the payload api and to check if there is a password change.
             */
            if (req.payloadAPI === 'local' && operation === 'update') {
              const isSameValue = originalDoc?.hashedPassword === value || !value

              if (!isSameValue) return value

              return originalDoc?.hashedPassword
            }

            if (operation === 'create' || operation === 'update') {
              try {
                const isSameValue = originalDoc?.hashedPassword === value

                if (operation === 'update' && isSameValue) return value

                const newPassword = !value ? generateRandomPassword() : value

                if (data?.sendEmail && operation === 'create') {
                  await req.payload.email.sendEmail({
                    from: '"MSDS System" <info@doruksistem.com.tr>',
                    to: data?.email,
                    subject: 'MSDS System - Create Password',
                    text: `${data?.fullname}, please complete your registration.`,
                    html: `
                      <b>Hello ${data?.fullname}, please complete your registration.</b>
                      <br />
                      <p>We have created an account for you on msds.net.tr. Please create a password to log in.</p>
                      <br />
                      <br />
                      <a href="${getServerSideURL()}/auth/complate-registration?email=${data?.email}" target="_blank">Click here to complete your registration.</a>
                    `,
                  })
                }

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
      name: 'sendEmail',
      type: 'checkbox',
      defaultValue: true,
      label: {
        tr: 'Oluşturma sonrası email gönder',
        en: 'Send email after creation',
      },
      admin: {
        description: {
          tr: 'Oluşturma işlemi sonrasında kullanıcının e-posta adresine hesap oluşturma işlemini tamamlaması için gerekli bilgiler gönderilir.',
          en: "The information required to complete the account creation process is sent to the user's email address after the creation process.",
        },
      },
    },
    {
      name: 'registrationCompleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
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
