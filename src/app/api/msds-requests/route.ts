import { NextRequest, NextResponse } from 'next/server'
import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(req: NextRequest) {
  try {
    // Always handle as multipart/form-data request
    const contentType = req.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Only multipart/form-data requests are supported' },
        { status: 415 },
      )
    }

    const payload = await getPayloadCMS()
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File is required for MSDS request' }, { status: 400 })
    }

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
      },
      file: payloadFile, // Direkt upload field'ına gönderiyoruz
    })

    return NextResponse.json(msdsRequest, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create MSDS request' },
      { status: 500 },
    )
  }
}
