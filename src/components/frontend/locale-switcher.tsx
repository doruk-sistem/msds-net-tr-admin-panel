'use client'

import React from 'react'
import { setCookie } from 'cookies-next/client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n/config'
import { useRouter } from 'next/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const localeItems = locales

  const changeLanguage = (value) => {
    setCookie('USER_LOCALE', value)
    router.refresh()
  }

  return (
    <Select defaultValue={locale} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {localeItems.map((lang) => (
            <SelectItem value={lang} key={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
