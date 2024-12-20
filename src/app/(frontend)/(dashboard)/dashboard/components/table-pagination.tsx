import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex items-center space-x-6 rounded-lg bg-white/50 dark:bg-slate-900 px-3 py-2 shadow-lg ring-1 ring-slate-900/10 dark:ring-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goPrev()}
          disabled={isFirstPage}
          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Önceki sayfa</span>
        </Button>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {pageNumberParam}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500">/</span>
          <span className="text-sm text-slate-400 dark:text-slate-500">{totalPages}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => goNext()}
          disabled={isLastPage}
          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Sonraki sayfa</span>
        </Button>
      </div>
    </div>
  )
}
