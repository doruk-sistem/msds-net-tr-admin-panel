'use client'

import { DataFromCollectionSlug } from 'payload'
import { MsdsDoc } from '@/payload-types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

import ActionsCell from './actions-cell'

export type Row = {
  name: DataFromCollectionSlug<'msdsContents'>['name']
  msdsContents: Array<{
    fileName: MsdsDoc['filename']
    contentUrl: MsdsDoc['url']
    msdsUniuqeId: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['msdsUniuqeId']
    id: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['id']
    msdsLanguage: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['msdsLanguage']
    preparationDate: string
    formNo: string
    newRegulationDate: string
    howManyRegulations: string
  }>
  publishedAt: DataFromCollectionSlug<'msdsContents'>['publishedAt']
}

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: 'MSDS Name',
    cell: ({
      row: {
        original: { name, msdsContents },
      },
    }) => {
      return (
        <div className="flex flex-col space-y-1">
          <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <FileText className="mr-1 h-3 w-3" />
              {msdsContents.length} versions
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published Date',
    cell: ({ row }) => {
      const date = row.original.publishedAt
      const formattedData = typeof date === 'string' ? formatDateTime(date) : ''

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
