'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import QRCodeSVG from 'react-qr-code'

const QRCodeComponent: React.FC = () => {
    const { id } = useDocumentInfo()

    if (!id) {
        console.log('QRCodeComponent: ID bulunamadı')
        return null
    }

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const qrValue = `${baseUrl}/admin/collections/msdsV2/${id}`

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault() // Form submit'i engelle
        e.stopPropagation() // Event bubbling'i engelle

        try {
            console.log('QRCodeComponent: İndirme başlatılıyor...')
            const svg = document.querySelector('.qr-code-svg')
            if (!svg) {
                console.error('QRCodeComponent: SVG elementi bulunamadı')
                return
            }
            console.log('QRCodeComponent: SVG elementi bulundu')

            // SVG'yi string'e çevir
            const svgData = new XMLSerializer().serializeToString(svg)
            console.log('QRCodeComponent: SVG stringe çevrildi')

            // SVG'yi base64'e çevir
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const svgUrl = URL.createObjectURL(svgBlob)
            console.log('QRCodeComponent: SVG Blob oluşturuldu')

            // Canvas oluştur
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                console.error('QRCodeComponent: Canvas context oluşturulamadı')
                return
            }
            console.log('QRCodeComponent: Canvas context oluşturuldu')

            // Canvas boyutunu ayarla
            canvas.width = 200
            canvas.height = 200
            console.log('QRCodeComponent: Canvas boyutu ayarlandı')

            // SVG'yi canvas'a çiz
            const img = new Image()
            img.onload = () => {
                console.log('QRCodeComponent: Resim yüklendi')
                ctx.drawImage(img, 0, 0, 200, 200)
                console.log('QRCodeComponent: Canvas\'a çizim yapıldı')

                const pngFile = canvas.toDataURL('image/png')
                console.log('QRCodeComponent: PNG dosyası oluşturuldu')

                // İndirme linki oluştur
                const downloadLink = document.createElement('a')
                downloadLink.download = `msds-qr-${id}.png`
                downloadLink.href = pngFile
                console.log('QRCodeComponent: İndirme linki oluşturuldu')

                downloadLink.click()
                console.log('QRCodeComponent: İndirme başlatıldı')

                // Temizlik
                URL.revokeObjectURL(svgUrl)
                console.log('QRCodeComponent: URL temizlendi')
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
        <div style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <QRCodeSVG
                className="qr-code-svg"
                value={qrValue}
                size={200}
            />
            <p style={{
                fontSize: '0.875rem',
                color: '#666',
                marginTop: '0.5rem'
            }}>
                MSDS QR Kodu
            </p>
            <button
                onClick={handleDownload}
                type="button"
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                }}
            >
                QR Kodu İndir
            </button>
        </div>
    )
}

export default QRCodeComponent 