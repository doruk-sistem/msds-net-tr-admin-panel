import type { CollectionConfig } from 'payload'

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
    defaultColumns: ['fullname', 'email', 'personalPhoneNumber'],
    useAsTitle: 'fullname',
  },
  auth: true,
  fields: [
    {
      name: 'fullname',
      label: {
        tr: 'İsim-Soyisim',
        en: 'Fullname',
      },
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'turkishIdentity',
      label: {
        tr: 'TC. Kimlik Numarası',
        en: 'Turkish Identity',
      },
      type: 'number',
    },
    {
      name: 'personalPhoneNumber',
      label: {
        tr: 'Kişisel Telefon Numarası',
        en: 'Personal Phone Number',
      },
      type: 'text',
    },
  ],
  timestamps: true,
}

export default CompanyUsers
