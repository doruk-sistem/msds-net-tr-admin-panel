'use client'

import React from 'react'
import QRCodeSVG from 'react-qr-code'

const QRCodeCell: React.FC<{ rowData: any }> = ({ rowData }) => {
    if (!rowData?.id) {
        console.log('QRCodeCell: ID bulunamadı')
        return null
    }

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const qrValue = `${baseUrl}/admin/collections/msdsV2/${rowData.id}`

    const handleDownload = async () => {
        try {
            console.log('QRCodeCell: İndirme başlatılıyor...')
            const svg = document.querySelector(`.qr-code-svg-${rowData.id}`)
            if (!svg) {
                console.error('QRCodeCell: SVG elementi bulunamadı')
                return
            }
            console.log('QRCodeCell: SVG elementi bulundu')

            // SVG'yi string'e çevir
            const svgData = new XMLSerializer().serializeToString(svg)
            console.log('QRCodeCell: SVG stringe çevrildi')

            // SVG'yi base64'e çevir
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const svgUrl = URL.createObjectURL(svgBlob)
            console.log('QRCodeCell: SVG Blob oluşturuldu')

            // Canvas oluştur
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                console.error('QRCodeCell: Canvas context oluşturulamadı')
                return
            }
            console.log('QRCodeCell: Canvas context oluşturuldu')

            // Canvas boyutunu ayarla
            canvas.width = 200
            canvas.height = 200
            console.log('QRCodeCell: Canvas boyutu ayarlandı')

            // SVG'yi canvas'a çiz
            const img = new Image()
            img.onload = () => {
                console.log('QRCodeCell: Resim yüklendi')
                ctx.drawImage(img, 0, 0, 200, 200)
                console.log('QRCodeCell: Canvas\'a çizim yapıldı')

                const pngFile = canvas.toDataURL('image/png')
                console.log('QRCodeCell: PNG dosyası oluşturuldu')

                // İndirme linki oluştur
                const downloadLink = document.createElement('a')
                downloadLink.download = `msds-qr-${rowData.id}.png`
                downloadLink.href = pngFile
                console.log('QRCodeCell: İndirme linki oluşturuldu')

                downloadLink.click()
                console.log('QRCodeCell: İndirme başlatıldı')

                // Temizlik
                URL.revokeObjectURL(svgUrl)
                console.log('QRCodeCell: URL temizlendi')
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
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            flexDirection: 'column',
            gap: '0.25rem'
        }}>
            <QRCodeSVG
                className={`qr-code-svg-${rowData.id}`}
                value={qrValue}
                size={40}
                style={{
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
            <button
                onClick={handleDownload}
                style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap'
                }}
            >
                İndir
            </button>
        </div>
    )
}

export default QRCodeCell 