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
    <form onSubmit={handleSubmitSearch} className="flex items-center space-x-3">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>
        <Input
          placeholder="Search by MSDS Name..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="pl-10 py-2 bg-white/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg shadow-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        {!!searchValue && (
          <Button
            variant="default"
            type="submit"
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all duration-200"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        )}

        {!!searchParam && (
          <Button
            variant="destructive"
            onClick={clearSearch}
            type="button"
            className="flex items-center space-x-2 shadow-lg shadow-destructive/30 transition-all duration-200"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>
    </form>
  )
}
