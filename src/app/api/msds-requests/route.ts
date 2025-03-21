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

    // // Get token from cookies
    // const token = req.cookies.get('token')?.value

    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    // }

    // Verify token
    // const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
    // let userId: string | number

    // try {
    //   const verified = await jwtVerify(token, secret)
    //   userId = (verified.payload as any).userId

    //   if (!userId) {
    //     return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 })
    //   }
    // } catch (error) {
    //   console.error('Token verification error:', error)
    //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    // }

    // We'll use the user data from the request instead of fetching it again

    let requestData: any
    let file: File | null = null

    // Handle multipart/form-data request
    const formData = await req.formData()
    file = formData.get('file') as File

    const companyResponse = await payload.findByID({
      id: formData.get('company') as string,
      collection: 'companies',
      depth: 0,
    })

    console.log('Company response:', companyResponse)

    const companyUserResponse = await payload.findByID({
      id: formData.get('requestedBy') as string,
      collection: 'companyUsers',
      depth: 0,
    })

    // Get other form data fields
    requestData = {
      productName: formData.get('productName') as string,
      description: formData.get('description') as string,
      status: 'pending' as 'pending' | 'inProgress' | 'completed',
      company: companyResponse,
      requestedBy: companyUserResponse,
    }

    // Create MSDS request with file
    let msdsRequest

    if (!file) {
      return NextResponse.json({ error: 'File is required for MSDS request' }, { status: 400 })
    }

    console.log('Uploading file:', file.name, file.type, file.size)

    try {
      // File upload için formData kullanılmalı, doğrudan dosya yüklemek için
      // Dosya içeriğini buffer'a çevir
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log(`Uploading file: ${file.name} ${file.type} ${file.size}`)

      // Payload CMS'in beklediği formatta dosya nesnesi oluştur
      const payloadFile = {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      }

      try {
        // Payload CMS'in doğrudan dosya yükleme özelliğini kullan
        // Önce fileMedia koleksiyonuna dosyayı yükle
        const uploadedFile = await payload.create({
          collection: 'fileMedia',
          data: {
            alt: file.name,
            caption: `MSDS Request: ${requestData.productName}`,
          },
          file: payloadFile, // Payload formatında dosya nesnesi kullan
        })

        console.log('File uploaded successfully to fileMedia collection:', uploadedFile.id)

        // Yüklenen dosyanın ID'sini requestData'ya ekle
        requestData.sdsFile = uploadedFile.id
      } catch (fileUploadError) {
        console.error('Error uploading file to fileMedia collection:', fileUploadError)
        throw new Error(`Dosya yükleme hatası: ${fileUploadError.message || 'Bilinmeyen hata'}`)
      }

      // Create MSDS request with file
      msdsRequest = await payload.create({
        collection: 'msdsRequests',
        data: requestData,
      })
    } catch (error) {
      console.error('File upload error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))

      // Hata mesajını daha detaylı hale getir
      let errorMessage = 'Dosya yükleme hatası'
      if (error instanceof Error) {
        errorMessage = `Dosya yükleme hatası: ${error.message}`
      }

      // Hata durumunda kullanıcıya bilgi ver
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    return NextResponse.json(msdsRequest, { status: 201 })
  } catch (error: any) {
    console.error('Error creating MSDS request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create MSDS request' },
      { status: 500 },
    )
  }
}
