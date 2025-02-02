import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import cantEraseYourself from './hooks/cantEraseYourself'
import { isAdmin } from '@/access/isAdmin'
import { getServerSideURL } from '@/utilities/getURL'

const AdminUsers: CollectionConfig = {
  slug: 'adminUsers',
  labels: {
    singular: {
      tr: 'Admin Kullanıcısı',
      en: 'Admin User',
    },
    plural: {
      tr: 'Admin Kullanıcıları',
      en: 'Admin Users',
    },
  },
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: authenticated,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    description: {
      tr: "Admin Kullanıcıları, admin panel'ini yönetebilen hesaplardır.",
      en: 'Admin Users manage admin panel.',
    },
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: ({ user }: any) => {
        return `Hey ${user.email}, reset your password!`
      },
      generateEmailHTML: ({ req, token, user }: any) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${getServerSideURL()}/auth/admin/reset-password?token=${token}`

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Hello, ${user.email}! Reset your password.</h1>
              <p>You can reset your password by clicking the link below.</p>
              <p>
                <a href="${resetPasswordURL}" target="_blank">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      hasMany: true,
      options: [
        {
          label: 'editor',
          value: 'editor',
        },
        {
          label: 'admin',
          value: 'admin',
        },
      ],
    },
  ],
  hooks: {
    beforeDelete: [cantEraseYourself],
  },
  timestamps: true,
}

export default AdminUsers
