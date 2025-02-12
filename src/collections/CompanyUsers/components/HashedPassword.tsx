'use client'

import { TextInput, useDocumentInfo, useField, useTranslation } from '@payloadcms/ui'
import { TextFieldClientProps } from 'payload'
import React, { useEffect, useState } from 'react'

const text = {
  passwordLabel: {
    tr: 'Parola',
    en: 'Password',
  },
  change: {
    tr: 'Değiştir',
    en: 'Change',
  },
  lock: {
    tr: 'Kitle',
    en: 'Lock',
  },
  passwordDescription: {
    tr: 'Auto-Generation için alanı boş bırakın.',
    en: 'Leave this field blank for Auto-Generation.',
  },
  hashadPasswordDescription: {
    tr: 'Şifrelenmiş parola, hesap şifresinin açığa çıkmaması için güvenlik amacıyla oluşturulmuş bir halidir. Hesap girişi esnasında bu şifre kullanılmaz. Sistem tarafından güvenlik amacıyla kullanılır.',
    en: 'Hashed password is a version of the account password created for security purposes to prevent its disclosure. This password is not used during account login. It just use by system for security.',
  },
}

export default function HashedPassword({ path }: TextFieldClientProps) {
  const [isLocked, setIsLocked] = useState(true)

  const { value, setValue } = useField<string>({ path })
  const { initialData } = useDocumentInfo()

  const {
    i18n: { language: lang },
  } = useTranslation()

  const handleButton = () => {
    setIsLocked((prev) => !prev)
  }

  useEffect(() => {
    setValue(isLocked ? initialData?.hashedPassword : '')
  }, [isLocked])

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ gap: '1rem' }}>
          <label className="field-label">{text.passwordLabel[lang]}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="field-type text" style={{ width: '100%' }}>
              <TextInput
                path={path}
                value={value}
                onChange={(v) => setValue(v)}
                required
                placeholder={text.passwordLabel[lang]}
                readOnly={isLocked}
              />
            </div>

            <div>
              <button
                className="btn btn--size-medium btn--style-primary"
                style={{
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                }}
                type="button"
                onClick={handleButton}
              >
                {text[isLocked ? 'change' : 'lock'][lang]}
              </button>
            </div>
          </div>
          <div className="field-description">{text.passwordDescription[lang]}</div>
        </div>
      </div>
    </>
  )
}
