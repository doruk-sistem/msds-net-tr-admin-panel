'use client'

import React, { useRef, useState } from 'react'
import { CellContext } from '@tanstack/react-table'
import QRCode from 'react-qr-code'
import {
  Download,
  FileScan,
  FileStack,
  FileText,
  MoreHorizontal,
  Printer,
  QrCode as QrCodeIcon,
  SquareArrowOutUpRight,
  XCircle,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
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

import formatDate from '@/utilities/formatDate'

import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const w = typeof window === 'undefined' ? null : window

export default function ActionsCell({ row }: CellContext<Row, unknown>): React.JSX.Element {
  const t = useTranslations('dashboardPage')
  const msds = row.original
  const {
    author,
    certificateDate,
    createdAt,
    formNo,
    msdsCreatedAt,
    msdsUpdatedAt,
    name,
    updatedCount,
    url,
    contentLanguage,
  } = msds

  return (
    <div className="flex justify-end items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1 px-3 py-1 h-8">
            <FileStack className="h-4 w-4" />
            <span>{t('msdsContentDataTable.viewDetails')}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <FileScan className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span>{name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {t('openTheContentDialog.dialogTitle', { name })}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="pt-4">
              {t('openTheContentDialog.dialogDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="relative flex flex-col space-y-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
              <MsdsContent
                url={url}
                details={{
                  author,
                  certificateDate,
                  createdAt,
                  formNo,
                  msdsCreatedAt,
                  msdsUpdatedAt,
                  updatedCount,
                  name,
                  contentLanguage,
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MsdsContentProps {
  url: Row['url']
  details: {
    name: Row['name']
    author: Row['author']
    certificateDate: Row['certificateDate']
    createdAt: Row['createdAt']
    formNo: Row['formNo']
    msdsCreatedAt: Row['msdsCreatedAt']
    msdsUpdatedAt: Row['msdsUpdatedAt']
    updatedCount: Row['updatedCount']
    contentLanguage: Row['contentLanguage']
  }
}

function MsdsContent({ url: _url, details }: MsdsContentProps): React.JSX.Element {
  const t = useTranslations()
  const locale = useLocale()
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef as any,
    bodyClass: 'flex justify-center mt-36',
  })

  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  // DÜZELTME: Eğer _url zaten tam bir URL ise başına origin ekleme
  let contentPath = typeof _url === 'string' ? encodeURI(_url) : '';
  let contentUrl = '';
  if (contentPath.startsWith('http://') || contentPath.startsWith('https://')) {
    contentUrl = contentPath;
  } else {
    contentUrl = `${w?.location?.origin}${contentPath}`;
  }

  const openPdfToNewTab = () => {
    w?.open(contentPath, '_blank')
  }

  const copyPDFLink = () => {
    w?.navigator.clipboard.writeText(contentUrl)

    toast({
      title: t('dashboardPage.openTheContentDialog.copyPDFLinkToastTitle') || 'Link Copied!',
      description: contentUrl,
    })
  }

  const downloadPDF = () => {
    downloadFile({
      fileURL: contentPath,
      fileName: `${details?.name || 'msds'}.pdf`,
    })
  }

  const calculateValidationDate = (certificateDate: string | null): string | null => {
    if (!certificateDate) return null;
    const date = new Date(certificateDate);
    date.setFullYear(date.getFullYear() + 5);
    return date.toISOString();
  };

  const getValidationStatus = (certificateDate: string | null): 'valid' | 'expired' | null => {
    if (!certificateDate) return null;
    const validationDate = new Date(calculateValidationDate(certificateDate) || '');
    return new Date() < validationDate ? 'valid' : 'expired';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('common.details')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip
            delayDuration={0}
            content={<p>{t('dashboardPage.openTheContentDialog.openTheMSDS')}</p>}
          >
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary"
              onClick={openPdfToNewTab}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip
            delayDuration={0}
            content={<p>{t('dashboardPage.openTheContentDialog.downloadTheMSDS')}</p>}
          >
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

          <Tooltip
            delayDuration={0}
            content={<p>{t('dashboardPage.openTheContentDialog.copyPDFLink')}</p>}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={copyPDFLink}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
            <DialogTrigger asChild>
              <Tooltip
                delayDuration={0}
                content={<p>{t('dashboardPage.openTheContentDialog.showQRCode')}</p>}
              >
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
                  <span>QR Code for {details.name}</span>
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

          {/* More Options (DropdownMenu) tamamen kaldırıldı */}
        </div>
      </div>

      <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.formNo')}</div>
          <div className="font-medium">{details.formNo ?? 'Not specified'}</div>
        </div>

        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.createdDate')}</div>
          <div className="font-medium">
            {details.msdsCreatedAt
              ? formatDate(details.msdsCreatedAt, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : 'Not specified'}
          </div>
        </div>

        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.lastUpdated')}</div>
          <div className="font-medium">
            {details.msdsUpdatedAt
              ? formatDate(details.msdsUpdatedAt, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : 'Not specified'}
          </div>
        </div>

        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.updateCount')}</div>
          <div className="font-medium">{details.updatedCount ?? 'Not specified'}</div>
        </div>

        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.author')}</div>
          <div className="font-medium">{details.author ?? 'Not specified'}</div>
        </div>

        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.certificateDate')}</div>
          <div className="font-medium">
            {details.certificateDate
              ? formatDate(details.certificateDate, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : 'Not specified'}
          </div>
        </div>
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-32 text-muted-foreground">
            {t('dashboardPage.openTheContentDialog.validationStatus.title')}
          </div>
          <div className="font-medium flex items-center gap-2">
            {details.certificateDate ? (
              <>
                {getValidationStatus(details.certificateDate) === 'valid' ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {t('dashboardPage.openTheContentDialog.validationStatus.validUntil')}{' '}
                    {formatDate(calculateValidationDate(details.certificateDate)!, locale)}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {t('dashboardPage.openTheContentDialog.validationStatus.expired')}
                  </Badge>
                )}
              </>
            ) : (
              t('dashboardPage.openTheContentDialog.validationStatus.notSpecified')
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 text-muted-foreground">{t('dashboardPage.openTheContentDialog.language')}</div>
          <div className="font-medium">
            {details.contentLanguage
              ? `${(details as any).contentLanguage.code} - ${(details as any).contentLanguage.name}`
              : 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  )
}
