import localeHelper from '@/utilities/localeHelper'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = await localeHelper.getUserLocale()

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
