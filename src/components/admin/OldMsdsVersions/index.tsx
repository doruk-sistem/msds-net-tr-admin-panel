'use client'

import { Button } from '@/components/admin/ui/button'
import { useField } from '@payloadcms/ui'
import { JSONFieldClientProps } from 'payload'
import React from 'react'

export default function OldMsdsVersions({ path }: JSONFieldClientProps) {
  const { value, setValue } = useField<string>({ path })

  console.log('value: ', value)

  return <div>test</div>
}
