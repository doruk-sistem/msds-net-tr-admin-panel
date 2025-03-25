import { CollectionConfig } from 'payload'

import { slugifyFieldText } from '@/hooks/slugifyFieldText'

const ContentLanguages: CollectionConfig = {
  slug: 'contentLanguages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  access: {
    admin: ({ req }) => false,
    create: ({ req }) => false,
    delete: ({ req }) => false,
    read: ({ req }) => false,
    update: ({ req }) => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [slugifyFieldText({ lower: true, strict: true })],
      },
    },
  ],
}

export default ContentLanguages
