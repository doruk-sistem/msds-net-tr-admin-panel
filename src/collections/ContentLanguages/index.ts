import { CollectionConfig } from 'payload'

import { slugifyFieldText } from '@/hooks/slugifyFieldText'

const ContentLanguages: CollectionConfig = {
  slug: 'contentLanguages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
    hidden: true,
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
