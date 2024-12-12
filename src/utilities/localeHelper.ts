import { cookies } from 'next/headers'
import { Locale, defaultLocale } from '@/i18n/config'

class LocaleHelper {
  private COOKIE_NAME = 'USER_LOCALE'

  public async getUserLocale() {
    const cookieStore = await cookies()
    return cookieStore.get(this.COOKIE_NAME)?.value || defaultLocale
  }

  public async setUserLocale(locale: Locale) {
    const cookieStore = await cookies()
    return cookieStore.set(this.COOKIE_NAME, locale)
  }

  public getCookieName() {
    return this.COOKIE_NAME
  }
}

const localeHelper = new LocaleHelper()

export default localeHelper
