import { FieldHook } from 'payload'

import slugify from 'slugify'

interface SlugifyOptions {
  replacement?: string
  remove?: RegExp
  lower?: boolean
  strict?: boolean
  locale?: string
  trim?: boolean
}

export const slugifyFieldText = (slugifyOptions?: SlugifyOptions): FieldHook => {
  return ({ value, operation }) => {
    if (operation === 'create' || operation === 'update') {
      if (typeof value === 'string') {
        return slugify(value, slugifyOptions)
      }

      return value
    }

    return value
  }
}
