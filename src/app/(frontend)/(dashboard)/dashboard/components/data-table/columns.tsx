'use client'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DataFromCollectionSlug } from 'payload'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from "lucide-react"
import ActionsCell from './actions-cell'
import formatDate from '@/utilities/formatDate'
import { Button } from '@/components/ui/button'
import { Printer, QrCodeIcon, SquareArrowOutUpRight } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useTranslations } from 'next-intl'
import { useReactToPrint } from 'react-to-print'

type MsdsContent = DataFromCollectionSlug<'msdsV2'>

export type Row = {
  id?: number
  _id?: string | number
  databaseId?: number
  name: MsdsContent['name']
  msdsCreatedAt: MsdsContent['msdsCreatedAt']
  msdsUpdatedAt: MsdsContent['msdsUpdatedAt']
  formNo: MsdsContent['formNo']
  updatedCount: MsdsContent['updatedCount']
  author: MsdsContent['author']
  certificateDate: MsdsContent['certificateDate']
  url: MsdsContent['url']
  createdAt: MsdsContent['createdAt']
  contentLanguage: {
    id: number
    code: string
    name: string
    createdAt: string
    updatedAt: string
  }
}
// QR Kod hücre bileşeni
const QRCodeCell = ({ row }: { row: any }) => {
  const t = useTranslations()
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [contentUrl, setContentUrl] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef as any,
    bodyClass: 'flex justify-center mt-36',
  })

  const msds = row.original
  const contentPath = typeof msds.url === 'string' ? encodeURI(msds.url) : ''

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContentUrl(`${window.location.origin}${contentPath}`)
    }
  }, [contentPath])

  return (
    <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setQrDialogOpen(true)}
        >
          <QrCodeIcon className="h-4 w-4" />
          <span>{t('dashboardPage.openTheContentDialog.showQRCode')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <QrCodeIcon className="h-5 w-5 text-primary" />
            <span>{t('dashboardPage.openTheContentDialog.dialogTitle', { name: msds.name })}</span>
          </DialogTitle>
          <DialogDescription>
            {t('dashboardPage.openTheContentDialog.showQRCodeDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <QRCode value={contentUrl} />
          </div>

          <div className="hidden">
            <div ref={contentRef}>
              <QRCode value={contentUrl} size={550} />
            </div>
          </div>

          <Button onClick={() => reactToPrintFn()} className="gap-2">
            <Printer className="h-4 w-4" />
            {t('dashboardPage.openTheContentDialog.showQRCodeDialog.print')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export const getColumns = (t: any): ColumnDef<Row>[] => [
  {
    accessorKey: 'formNo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 justify-start px-0"
        >
          {t('msdsContentDataTable.formNo')}
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const formNo = row.original.formNo
      return (
        <div className="font-medium text-sm text-slate-600">
          {formNo || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return t('msdsContentDataTable.name')
    },
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
    header: ({ column }) => {
      return t('msdsContentDataTable.language')  
    },
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
    accessorKey: 'certificateDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 justify-start px-0"
        >
          {t('msdsContentDataTable.publishedDate')}  
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.certificateDate
      return (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900 dark:text-slate-100">
            {date ? formatDate(date) : 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'qrCode',
    header: t('msdsContentDataTable.qrCode'),  
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 justify-start px-0">
          <QRCodeCell row={row} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
]
