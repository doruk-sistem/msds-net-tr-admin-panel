'use client'

import React, { useRef, useState } from 'react'
import { CellContext } from '@tanstack/react-table'
import QRCode from 'react-qr-code'
import locale from 'locale-codes'
import {
  ArrowUpRight,
  Download,
  FileScan,
  FileStack,
  FileText,
  MoreHorizontal,
  MoveUpRight,
  Printer,
  QrCode as QrCodeIcon,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Tooltip from '@/components/ui/tooltip-basic'

import downloadFile from '@/utilities/downloadFile'

import { useToast } from '@/hooks/use-toast'

import { Row } from './columns'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const w = typeof window === 'undefined' ? null : window

export default function ActionsCell({ row }: CellContext<Row, unknown>): React.JSX.Element {
  const t = useTranslations('dashboardPage')
  const msds = row.original
  const msdsContents = msds.msdsContents

  return (
    <div className="flex justify-end items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileStack className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <FileScan className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span>{msds?.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {t('openTheContentDialog.dialogTitle', { name: msds?.name })}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="pt-4">
              {t('openTheContentDialog.dialogDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {msdsContents.map((item, index) => (
              <div
                key={item.id}
                className="relative flex flex-col space-y-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="absolute -left-2 top-4">
                  <Badge variant="outline" className="bg-background">
                    v{index + 1}
                  </Badge>
                </div>

                <MsdsContent
                  contentUrl={item.contentUrl}
                  filename={item.fileName}
                  msdsLanguage={item.msdsLanguage}
                  msdsName={msds?.name}
                  msdsDetails={{
                    preparationDate: item?.preparationDate,
                    formNo: item?.formNo,
                    newRegulationDate: item?.newRegulationDate,
                    howManyRegulations: item?.howManyRegulations,
                  }}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MsdsContentProps {
  contentUrl: Row['msdsContents'][0]['contentUrl']
  filename: Row['msdsContents'][0]['fileName']
  msdsName: Row['name']
  msdsLanguage: Row['msdsContents'][0]['msdsLanguage']
  msdsDetails: {
    preparationDate: Row['msdsContents'][0]['preparationDate']
    formNo: Row['msdsContents'][0]['formNo']
    newRegulationDate: Row['msdsContents'][0]['newRegulationDate']
    howManyRegulations: Row['msdsContents'][0]['howManyRegulations']
  }
}

function MsdsContent({
  contentUrl: _contentUrl,
  filename,
  msdsName,
  msdsLanguage,
  msdsDetails,
}: MsdsContentProps): React.JSX.Element {
  const t = useTranslations('dashboardPage')
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef as any,
    bodyClass: 'flex justify-center mt-36',
  })

  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  const contentPath = typeof _contentUrl === 'string' ? encodeURI(_contentUrl) : ''
  const contentUrl = `${w?.location?.origin}${contentPath}`

  const lang = `${msdsLanguage} - ${locale.getByTag(msdsLanguage).name}${
    locale.getByTag(msdsLanguage).location ? ' - ' + locale.getByTag(msdsLanguage).location : ''
  }`

  const openPdfToNewTab = () => {
    w?.open(contentPath, '_blank')
  }

  const copyPDFLink = () => {
    w?.navigator.clipboard.writeText(contentUrl)

    toast({
      title: 'Link Copied!',
      description: contentUrl,
    })
  }

  const downloadPDF = () => {
    downloadFile({
      fileURL: contentPath,
      fileName: filename || 'msds.pdf',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">{lang}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Form No: {msdsDetails.formNo ?? 'N/A'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip delayDuration={0} content={<p>{t('openTheContentDialog.openTheMSDS')}</p>}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary"
              onClick={openPdfToNewTab}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip delayDuration={0} content={<p>{t('openTheContentDialog.downloadTheMSDS')}</p>}>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadPDF}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Tooltip>

          <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
            <DialogTrigger asChild>
              <Tooltip delayDuration={0} content={<p>{t('openTheContentDialog.showQRCode')}</p>}>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => setQrDialogOpen(true)}
                  >
                    <QrCodeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Tooltip>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <QrCodeIcon className="h-5 w-5 text-primary" />
                  <span>QR Code for {msdsName}</span>
                </DialogTitle>
                <DialogDescription>
                  {t('openTheContentDialog.showQRCodeDialog.description')}
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
                  {t('openTheContentDialog.showQRCodeDialog.print')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                {t('openTheContentDialog.moreOptions')}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={copyPDFLink} className="gap-2">
                <FileText className="h-4 w-4" />
                <span>{t('openTheContentDialog.copyPDFLink')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-3 text-sm">
        <div className="space-y-1">
          <div className="text-muted-foreground">Preparation Date</div>
          <div className="font-medium">{msdsDetails.preparationDate ?? 'Not specified'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">New Regulation Date</div>
          <div className="font-medium">{msdsDetails.newRegulationDate ?? 'Not specified'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">Edit Count</div>
          <div className="font-medium">{msdsDetails.howManyRegulations ?? 'Not specified'}</div>
        </div>
      </div>
    </div>
  )
}
