'use client'

import React, { useState, useEffect } from 'react'
import QRCodeSVG from 'react-qr-code'

const QRCodeCell: React.FC<{ rowData: any; qrSize?: number }> = ({ rowData, qrSize = 50 }) => {
    const [contentUrl, setContentUrl] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined' && rowData?.filename) {
            const contentPath = `/api/msdsV2/file/${rowData.filename}`
            setContentUrl(`${window.location.origin}${contentPath}`)
        }
    }, [rowData?.filename])

    if (!rowData?.id) {
        return null
    }

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const svg = document.querySelector(`.qr-code-svg-${rowData.id}`)
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

            canvas.width = qrSize
            canvas.height = qrSize

            const img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0, qrSize, qrSize)
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = `msds-qr-${rowData.id}.png`
                downloadLink.href = pngFile
                downloadLink.click()
                URL.revokeObjectURL(svgUrl)
            }

            img.onerror = (error) => {
                console.error('QRCodeCell: Resim yüklenirken hata:', error)
            }

            img.src = svgUrl
        } catch (error) {
            console.error('QRCodeCell: Beklenmeyen hata:', error)
        }
    }

    return (
        <div className="flex flex-col gap-1 p-2 items-center">
            <QRCodeSVG
                className={`qr-code-svg-${rowData.id}`}
                value={contentUrl}
                size={qrSize}
                style={{
                    width: qrSize,
                    height: qrSize
                }}
            />
            <button
                onClick={handleDownload}
                type="button"
                className="w-12 h-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
            >
                İndir
            </button>
        </div>
    )
}

export default QRCodeCell 