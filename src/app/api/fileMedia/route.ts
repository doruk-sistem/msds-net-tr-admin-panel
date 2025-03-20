import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    console.log(file)

    // if (!file) {
    //   return NextResponse.json(
    //     { error: 'No file provided' },
    //     { status: 400 }
    //   )
    // }

    // // Validate file type
    // const allowedTypes = [
    //   'application/pdf',
    //   'application/msword',
    //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // ]

    // if (!allowedTypes.includes(file.type)) {
    //   return NextResponse.json(
    //     { error: `Invalid file type: ${file.type}. Only PDF and Word documents are allowed.` },
    //     { status: 400 }
    //   )
    // }

    try {
      // Upload to Vercel Blob
      //   const blob = await put(file.name, file, {
      //     access: 'public',
      //     token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN
      //   })

      //   if (!blob?.url) {
      //     throw new Error('Blob upload failed - no URL returned')
      //   }

      // Create file media document
      //   const fileMedia = await payload.create({
      //     collection: 'msdsRequests',
      //     data: {
      //       alt: file.name,
      //       filename: file.name,
      //       mimeType: file.type,
      //       url: blob.url,
      //     },
      //     file: {
      //       data: file,
      //       mimetype: file.type,
      //       name: file.name,
      //       size: file.size,
      //     },
      //     overrideAccess: true,
      //   })

      if (!fileMedia) {
        throw new Error('Failed to create file media document')
      }

      return NextResponse.json({
        success: true,
        fileMedia,
        url: blob.url,
      })
    } catch (uploadError) {
      console.error('Specific upload error:', uploadError)
      return NextResponse.json(
        {
          error: 'File upload failed',
          details: uploadError instanceof Error ? uploadError.message : 'Unknown error',
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json(
      {
        error: 'Error processing file upload',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
