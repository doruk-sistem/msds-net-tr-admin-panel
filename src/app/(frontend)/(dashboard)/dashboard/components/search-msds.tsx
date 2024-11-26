'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function SearchMsds() {
  const [searchValue, setSearchValue] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const searchParam = searchParams.get('name')

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    params.set('name', searchValue)
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('name')
    params.set('page', '1')

    setSearchValue('')

    router.push(`?${params.toString()}`)
  }

  useEffect(() => {
    if (searchParam) {
      setSearchValue(searchParam)
    }
  }, [searchParam])

  return (
    <form onSubmit={handleSubmitSearch} className="flex gap-3">
      <Input
        placeholder="Search by MSDS Name..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className="max-w-sm"
      />
      {!!searchValue && (
        <Button variant="outline" size="icon" type="submit">
          <Search className="w-5 h-5" />
        </Button>
      )}
      {!!searchParam && (
        <Button size="icon" variant="destructive" onClick={clearSearch} type="button">
          <X className="w-5 h-5" />
        </Button>
      )}
    </form>
  )
}
