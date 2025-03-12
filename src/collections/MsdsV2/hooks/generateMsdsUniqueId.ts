import { type FieldHook } from 'payload'

import slugify from 'slugify'

export const generateMsdsUniqueId: FieldHook = async ({ req, originalDoc, siblingData }) => {
  if (
    !originalDoc?.company ||
    !originalDoc?.id ||
    !originalDoc?.name ||
    !siblingData?.contentLanguage
  ) {
    return ''
  }

  try {
    const company = await req.payload.findByID({
      id: originalDoc.company,
      collection: 'companies',
      depth: 0,
    })

    const contentLanguageId = typeof siblingData.contentLanguage === 'object' 
    ? siblingData.contentLanguage.id 
    : siblingData.contentLanguage

    const contentLanguage = await req.payload.findByID({
      id: contentLanguageId,
      collection: 'contentLanguages',
      depth: 0,
    })

    if (!company?.companyName || !contentLanguage?.code) {
      return ''
    }

    const msdsCompany = company.companyName
    const msdsId = originalDoc.id
    const msdsName = originalDoc.name
    const msdsLanguage = contentLanguage.code

    return slugify(`${msdsCompany}-${msdsName}-${msdsId}-${msdsLanguage}`, {
      strict: true,
      lower: true,
    })
  } catch (error) {
    console.error('generateMsdsUniqueId hook error:', error)
    return ''
  }
}
