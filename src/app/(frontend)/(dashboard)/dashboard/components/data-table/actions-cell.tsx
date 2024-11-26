'use client'
import React, { useRef } from 'react'
import { CellContext } from '@tanstack/react-table'
import QRCode from 'react-qr-code'
import {
  ArrowUpRight,
  Download,
  FileDown,
  FileScan,
  FileText,
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

import { useToast } from '@/hooks/use-toast'

import { Row } from './columns'
import downloadFile from '@/utilities/downloadFile'

export default function ActionsCell({ row }: CellContext<Row, unknown>): React.JSX.Element {
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef as any,
    bodyClass: 'flex justify-center mt-36',
  })

  const item = row.original

  const contentPath = typeof item.contentUrl === 'string' ? encodeURI(item.contentUrl) : ''
  const contentUrl = `${window.location.origin}${contentPath}`

  const openPdfToNewTab = () => {
    window.open(contentPath, '_blank')
  }

  const copyPDFLink = () => {
    toast({
      title: 'Link Copied!',
    })

    window.navigator.clipboard.writeText(contentUrl)
  }

  const downloadPDF = () => {
    downloadFile({
      fileURL: contentPath,
      fileName: item.fileName || 'msds.pdf',
    })
  }

  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        className="mr-4 text-primary hover:text-primary"
        onClick={openPdfToNewTab}
      >
        <FileText className="h-4 w-4 mr-1" />
        Open the MSDS
        <ArrowUpRight className="h-4 w-4 ml-1" />
      </Button>
      <Tooltip delayDuration={150} content={<p>Download the MSDS</p>}>
        <Button variant="outline" className="mr-4" onClick={downloadPDF}>
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
                    {item.name} - QR Code
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
            <Button variant="outline" className="mr-4" size="icon">
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
  )
}
