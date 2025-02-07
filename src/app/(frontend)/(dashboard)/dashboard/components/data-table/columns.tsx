'use client'

import { DataFromCollectionSlug } from 'payload'
import { ColumnDef } from '@tanstack/react-table'

import ActionsCell from './actions-cell'
import formatDate from '@/utilities/formatDate'
import { Button } from '@/components/ui/button'
import { SquareArrowOutUpRight } from 'lucide-react'

type MsdsContent = DataFromCollectionSlug<'msdsV2'>

export type Row = {
  name: MsdsContent['name']
  msdsCreatedAt: MsdsContent['msdsCreatedAt']
  msdsUpdatedAt: MsdsContent['msdsUpdatedAt']
  formNo: MsdsContent['formNo']
  updatedCount: MsdsContent['updatedCount']
  author: MsdsContent['author']
  certificateDate: MsdsContent['certificateDate']
  url: MsdsContent['url']
  createdAt: MsdsContent['createdAt']
  contentLanguage: MsdsContent['contentLanguage']
}

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: 'MSDS Name',
    cell: ({
      row: {
        original: { name, url },
      },
    }) => {
      return (
        <div className="flex items-center space-x-1">
          <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="ghost" size="sm">
                <SquareArrowOutUpRight className="h-3 w-3" />
              </Button>
            </a>
          ) : null}
        </div>
      )
    },
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => {
      const language = row.original.contentLanguage
      const formattedLanguage =
        typeof language === 'object' ? `${language?.code} (${language?.name})` : ''

      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900 dark:text-slate-100">{formattedLanguage}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published Date',
    cell: ({ row }) => {
      const date = row.original.msdsCreatedAt
      const formattedData = typeof date === 'string' ? formatDate(date) : ''

      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900 dark:text-slate-100">{formattedData}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
]
