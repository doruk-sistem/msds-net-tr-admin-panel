import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface Props {
  totalPages: number
}

export default function TablePagination({ totalPages }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageNumberParam = Number(searchParams.get('page')) || 1

  const isFirstPage = pageNumberParam === 1
  const isLastPage = pageNumberParam === totalPages

  const goPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('page', String(page))

    router.push(`?${params.toString()}`)
  }

  const goPrev = () => {
    if (isFirstPage) return

    goPage(pageNumberParam - 1)
  }

  const goNext = () => {
    if (isLastPage) return

    goPage(pageNumberParam + 1)
  }

  return (
    <div className="flex items-center justify-end py-4">
      <Button variant="outline" size="sm" onClick={() => goPrev()} disabled={isFirstPage}>
        Previous
      </Button>
      <p className="mx-5 text-sm inline-block">
        <span className="font-bold">{pageNumberParam}</span> <span>/ {totalPages}</span>
      </p>
      <Button variant="outline" size="sm" onClick={() => goNext()} disabled={isLastPage}>
        Next
      </Button>
    </div>
  )
}
