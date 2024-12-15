'use client'

import { PaginatedDocs } from 'payload'
import { MsdsContent, MsdsDoc } from '@/payload-types'
import { ColumnDef } from '@tanstack/react-table'

import ActionsCell from './actions-cell'
import { formatDateTime } from '@/utilities/formatDateTime'

export type Row = {
  name: PaginatedDocs<MsdsContent>['docs'][0]['name']
  msdsContents: Array<{
    fileName: MsdsDoc['filename']
    contentUrl: MsdsDoc['url']
    msdsUniuqeId: PaginatedDocs<MsdsContent>['docs'][0]['msdsContent'][0]['msdsUniuqeId']
    id: PaginatedDocs<MsdsContent>['docs'][0]['msdsContent'][0]['id']
    msdsLanguage: PaginatedDocs<MsdsContent>['docs'][0]['msdsContent'][0]['msdsLanguage']
  }>
  publishedAt: PaginatedDocs<MsdsContent>['docs'][0]['publishedAt']
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
      return <div className="flex gap-2 font-bold">{name}</div>
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
