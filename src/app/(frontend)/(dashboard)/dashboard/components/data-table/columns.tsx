'use client'

import { DataFromCollectionSlug } from 'payload'
import { MsdsDoc } from '@/payload-types'
import { ColumnDef } from '@tanstack/react-table'

import ActionsCell from './actions-cell'
import { formatDateTime } from '@/utilities/formatDateTime'

export type Row = {
  name: DataFromCollectionSlug<'msdsContents'>['name']
  msdsContents: Array<{
    fileName: MsdsDoc['filename']
    contentUrl: MsdsDoc['url']
    msdsUniuqeId: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['msdsUniuqeId']
    id: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['id']
    msdsLanguage: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['msdsLanguage']
    preparationDate: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['preparation_date']
    formNo: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['form_no']
    newRegulationDate: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['new_regulation_date']
    howManyRegulations: DataFromCollectionSlug<'msdsContents'>['msdsContent'][0]['how_many_regulations']
  }>
  publishedAt: DataFromCollectionSlug<'msdsContents'>['publishedAt']
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
