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
    defaultColumns: ['fullname', 'email', 'personalPhoneNumber', 'company'],
    useAsTitle: 'fullname',
    listSearchableFields: ['fullname', 'email'],
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
      required: true,
    },
    {
      name: 'email',
      type: 'email',
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
  timestamps: true,
}

export default CompanyUsers
