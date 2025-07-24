import type { CollectionConfig } from 'payload'

import bcrypt from 'bcryptjs'

import generateRandomPassword from '@/utilities/generatePassword'
import { getServerSideURL } from '@/utilities/getURL'

import { authenticated } from '../../access/authenticated'
import { sendEmail } from '@/lib/email'

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
                  // Kullanıcının başka şirketlerde kayıtlı olup olmadığını kontrol et
                  const existingUsers = await req.payload.find({
                    collection: 'companyUsers',
                    where: {
                      email: {
                        equals: data?.email,
                      },
                    },
                    depth: 0,
                  })

                  // Eğer bu kullanıcının başka şirketlerde kaydı yoksa email gönder
                  if (existingUsers.docs.length === 0) {
                    await sendEmail({
                      to: data?.email,
                      subject: 'MSDS System - Create Password',
                      html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                          <div style="text-align: center; margin-bottom: 20px;">
                            <img src="https://msds.net.tr/msds-com-tr-logo.png" alt="MSDS System Logo" style="width: 180px;" />
                          </div>
                          <h2 style="color: #333;">Welcome to MSDS System!</h2>
                          <p>Hello <strong>${data?.fullname}</strong>,</p>
                          <p>We have created an account for you on msds.net.tr. To complete your registration and set up your password, please click the button below:</p>
                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${getServerSideURL()}/auth/complate-registration?email=${data?.email}" 
                               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                              Complete Registration
                            </a>
                          </div>
                          <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                          <p style="word-break: break-all; color: #666;">
                            ${getServerSideURL()}/auth/complate-registration?email=${data?.email}
                          </p>
                          <hr style="border: 1px solid #eee; margin: 20px 0;">
                          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
                        </div>
                      `,
                      text: `${data?.fullname}, please complete your registration by clicking the link below:\n\n${getServerSideURL()}/auth/complate-registration?email=${data?.email}`,
                    })
                  }
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
