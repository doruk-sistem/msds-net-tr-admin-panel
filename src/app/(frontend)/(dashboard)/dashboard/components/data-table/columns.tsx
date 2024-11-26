'use client'

import { PaginatedDocs } from 'payload'
import { Msd } from '@/payload-types'
import { ColumnDef } from '@tanstack/react-table'
import { Files } from 'lucide-react'

import ActionsCell from './actions-cell'
import { formatDateTime } from '@/utilities/formatDateTime'

export type Row = {
  name: PaginatedDocs<Msd>['docs'][0]['msdsName']
  fileName: PaginatedDocs<Msd>['docs'][0]['filename']
  contentUrl: PaginatedDocs<Msd>['docs'][0]['url']
  publishedAt: PaginatedDocs<Msd>['docs'][0]['publishedAt']
}

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: 'MSDS Name',
    cell: ({
      row: {
        original: { name },
      },
    }) => {
      return (
        <div className="text-black flex gap-2">
          <Files />
          {name}
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

      return formattedData
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
]
