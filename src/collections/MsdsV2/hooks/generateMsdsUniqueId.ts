import { type FieldHook } from 'payload'

import slugify from 'slugify'

export const generateMsdsUniqueId: FieldHook = async ({ req, originalDoc, siblingData }) => {
  const company = await req.payload.findByID({
    id: originalDoc?.company,
    collection: 'companies',
    depth: 0,
  })

  const contentLanguageId = siblingData?.contentLanguage

  const contentLanguage = await req.payload.findByID({
    id: contentLanguageId,
    collection: 'contentLanguages',
    depth: 0,
  })

  const msdsCompany = slugify(company.companyName, { strict: true })
  const msdsId = originalDoc?.id
  const msdsName = slugify(originalDoc?.name, { strict: true })
  const msdsLanguage = contentLanguage.code

  return `${msdsCompany}-${msdsName}-${msdsId}-${msdsLanguage}`
}
