'use client'

import React, { useRef } from 'react'
import { CellContext } from '@tanstack/react-table'
import QRCode from 'react-qr-code'
import locale from 'locale-codes'
import {
  ArrowUpRight,
  Download,
  FileScan,
  FileStack,
  FileText,
  Maximize2,
  MoreHorizontal,
  Printer,
  QrCode as QrCodeIcon,
} from 'lucide-react'

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
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog-basic'

import downloadFile from '@/utilities/downloadFile'
import { useToast } from '@/hooks/use-toast'
import { Row } from './columns'

const w = typeof window === 'undefined' ? null : window

export default function ActionsCell({ row }: CellContext<Row, unknown>): React.JSX.Element {
  const msds = row.original
  const msdsContents = msds.msdsContents

  return (
    <div className="flex justify-end items-center">
      <div className="inline-block ">
        <Dialog
          DialogContent={
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-center items-center">
                  <FileScan className="mr-2" />
                  {msds.name} - Msds Contents (All Languages)
                </DialogTitle>
                <DialogDescription className="text-center">
                  MSDS contents are available here.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                {msdsContents.map((item) => (
                  <div key={item.id}>
                    <MsdsContent
                      contentUrl={item.contentUrl}
                      filename={item.fileName}
                      msdsLanguage={item.msdsLanguage}
                      msdsName={msds.name}
                    />
                  </div>
                ))}
              </div>
            </>
          }
        >
          <Button variant="outline" className="mr-4">
            <FileStack className="h-4 w-4 mr-2" /> Open the Content
            <Maximize2 className="h-3 w-3 ml-2" />
          </Button>
        </Dialog>
      </div>
    </div>
  )
}

interface MsdsContentProps {
  contentUrl: Row['msdsContents'][0]['contentUrl']
  filename: Row['msdsContents'][0]['fileName']
  msdsName: Row['name']
  msdsLanguage: Row['msdsContents'][0]['msdsLanguage']
}

function MsdsContent({
  contentUrl: _contentUrl,
  filename,
  msdsName,
  msdsLanguage,
}: MsdsContentProps): React.JSX.Element {
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef as any,
    bodyClass: 'flex justify-center mt-36',
  })

  const contentPath = typeof _contentUrl === 'string' ? encodeURI(_contentUrl) : ''
  const contentUrl = `${w?.location?.origin}${contentPath}`

  const lang = `${msdsLanguage} - ${locale.getByTag(msdsLanguage).name}${locale.getByTag(msdsLanguage).location ? ' - ' + locale.getByTag(msdsLanguage).location : ''}`

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
    <div className="flex justify-between items-center w-full hover:bg-foreground/5 transition-colors py-2 px-3 rounded-md">
      <Button variant="link" className="mr-3 px-0" onClick={openPdfToNewTab}>
        <FileText className="h-4 w-4 mr-1" />
        {lang}
        <ArrowUpRight className="h-4 w-4 ml-1" />
      </Button>
      <div className="space-x-2">
        <Tooltip delayDuration={150} content={<p>Download the MSDS</p>}>
          <Button variant="outline" size="icon" onClick={downloadPDF}>
            <Download className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip delayDuration={150} content={<p>Show QR Code</p>}>
          <div className="inline-block ">
            <Dialog
              DialogContent={
                <>
                  <DialogHeader>
                    <DialogTitle className="flex justify-center items-center">
                      <FileScan className="mr-2" />
                      {msdsName} ({lang}) - QR Code
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      You can print this qr code
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-2 gap-6">
                    <QRCode value={contentUrl} />
                    <div className="hidden">
                      <div ref={contentRef}>
                        <QRCode value={contentUrl} size={550} />
                      </div>
                    </div>
                    <Button onClick={() => reactToPrintFn()}>
                      <Printer className="mr-1" />
                      Print / Save as PDF
                    </Button>
                  </div>
                </>
              }
            >
              <Button variant="outline" size="icon">
                <QrCodeIcon className="h-4 w-4" />
              </Button>
            </Dialog>
          </div>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>More Options</DropdownMenuLabel>
            <DropdownMenuItem onClick={copyPDFLink}>
              <FileText className="h-3 w-3" />
              Copy PDF Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
