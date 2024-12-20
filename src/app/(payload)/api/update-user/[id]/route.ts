import { NextRequest, NextResponse } from 'next/server'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import validateAuthorization from '@/utilities/validate-authorization'

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const isInvalid = await validateAuthorization(req)
    if (!!isInvalid) {
      return isInvalid
    }

    const { id } = await params
    const queryParams = Object.fromEntries(new URL(req.url).searchParams.entries())

    const body = await req.json()

    const payload = await getPayloadCMS()

    const response = await payload.update({
      collection: 'companyUsers',
      id,
      data: body,
      depth: Number(queryParams.depty) || 1,
    })

    if (response) {
      delete response.apiKey
      delete response.hashedPassword
      delete response.apiKeyIndex
      delete response.enableAPIKey
    }

    return NextResponse.json(response)
  } catch (error) {
    let status = 500
    let statusText = 'Internal Server Error'
    let errorPayload = error

    if (error?.name && error?.name === 'TokenExpiredError') {
      status = 403
      statusText = 'Forbidden'
    }

    return NextResponse.json(
      {
        error: errorPayload,
      },
      {
        status,
        statusText,
      },
    )
  }
}
