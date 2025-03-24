import { NextRequest, NextResponse } from 'next/server'
import getPayloadCMS from '@/utilities/getPayloadCMS'
import { put } from '@vercel/blob'  // Eklendi

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadCMS()
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
    }

    // Debug için token'ı kontrol edelim - BU KISMI EKLEYECEĞİZ
    const token = process.env.BLOB_READ_WRITE_TOKEN
    console.log('Token başlangıcı:', token?.substring(0, 20))

    const blob = await put(file.name, file, {
      access: 'public',
      token: token || '' // Undefined olma ihtimaline karşı
    })

    // Dosyayı buffer'a çevir
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Payload için dosya objesi oluştur
    const payloadFile = {
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    }

    const companyResponse = await payload.findByID({
      id: formData.get('company') as string,
      collection: 'companies',
      depth: 0,
    })

    const companyUserResponse = await payload.findByID({
      id: formData.get('requestedBy') as string,
      collection: 'companyUsers',
      depth: 0,
    })

    // MSDS request'i oluştur (direkt upload ile)
    const msdsRequest = await payload.create({
      collection: 'msdsRequestsV2',
      data: {
        productName: formData.get('productName') as string,
        description: formData.get('description') as string,
        status: 'pending',
        company: companyResponse,
        requestedBy: companyUserResponse,
        url: blob.url,
      },
      file: payloadFile, // Direkt upload field'ına gönderiyoruz
    })

    return NextResponse.json(msdsRequest, { status: 201 })
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      token: process.env.BLOB_READ_WRITE_TOKEN ? 'Token var' : 'Token yok'
    })
    
    return NextResponse.json({ 
      error: 'Dosya yükleme hatası',
      details: error.message,
      tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN
    }, { status: 500 })
  }
}
