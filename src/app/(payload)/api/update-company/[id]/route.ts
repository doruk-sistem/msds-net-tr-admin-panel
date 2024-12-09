import getPayloadCMS from '@/utilities/getPayloadCMS'
import { verifyJWT } from '@/utilities/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const queryParams = Object.fromEntries(new URL(req.url).searchParams.entries())

    const body = await req.json()
    const authorization = req.headers.get('Authorization')

    if (!authorization) {
      return NextResponse.json(
        {
          message: 'Invalid authorization token',
        },
        { status: 401, statusText: 'Unauthorized' },
      )
    }

    verifyJWT(authorization)

    const payload = await getPayloadCMS()

    const response = await payload.update({
      collection: 'companies',
      id,
      data: body,
      depth: Number(queryParams.depty) || 1,
    })

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
