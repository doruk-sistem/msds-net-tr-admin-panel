'use client'

import React, { useState, useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import QRCodeSVG from 'react-qr-code'

const QRCodeComponent: React.FC = () => {
    const { id } = useDocumentInfo()
    const [baseUrl, setBaseUrl] = useState('')

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])

    if (!id) {
        return null
    }

    const qrValue = `${baseUrl}/api/msdsV2/${id}/file`

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const svg = document.querySelector('.qr-code-svg')
            if (!svg) {
                return
            }

            const svgData = new XMLSerializer().serializeToString(svg)
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const svgUrl = URL.createObjectURL(svgBlob)

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                return
            }

            canvas.width = 200
            canvas.height = 200

            const img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 200, 200)
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = `msds-qr-${id}.png`
                downloadLink.href = pngFile
                downloadLink.click()
                URL.revokeObjectURL(svgUrl)
            }

            img.onerror = (error) => {
                console.error('QRCodeComponent: Resim yüklenirken hata:', error)
            }

            img.src = svgUrl
        } catch (error) {
            console.error('QRCodeComponent: Beklenmeyen hata:', error)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <QRCodeSVG
                className="qr-code-svg"
                value={qrValue}
                size={200}
            />
            <p className="text-sm text-gray-600 mt-2">
                MSDS QR Kodu
            </p>
            <button
                onClick={handleDownload}
                type="button"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
            >
                QR Kodu İndir
            </button>
        </div>
    )
}

export default QRCodeComponent 