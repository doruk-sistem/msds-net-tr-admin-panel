'use client'

import React from 'react'
import { setCookie } from 'cookies-next/client'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Languages } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { locales } from '@/i18n/config'

const languageNames = {
  en: 'English',
  tr: 'Türkçe'
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const changeLanguage = (value) => {
    setCookie('USER_LOCALE', value)
    router.refresh()
  }

  return (
    <Select defaultValue={locale} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[140px] h-8">
        <Languages className="h-4 w-4 mr-2" />
        <span>{languageNames[locale]}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((lang) => (
            <SelectItem value={lang} key={lang}>
              {languageNames[lang]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
