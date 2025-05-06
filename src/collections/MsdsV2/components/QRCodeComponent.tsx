'use client'

import { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import QRCodeCell from './QRCodeCell'

const QRCodeComponent: React.FC = () => {
    const { id } = useDocumentInfo() as any
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (id) {
            fetch(`/api/msdsV2/${id}`)
                .then(res => res.json())
                .then(resData => setData(resData))
                .catch(err => {
                    console.error('MSDS fetch error:', err)
                    setData(null)
                })
        }
    }, [id])

    if (!id || !data) {
        return null
    }

    return <QRCodeCell rowData={{ ...data, id }} qrSize={400} />
}

export default QRCodeComponent 