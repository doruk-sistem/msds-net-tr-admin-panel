import { NextRequest, NextResponse } from 'next/server'

import authHelper from './authHelper'

export default async function validateAuthorization(req: NextRequest) {
  const authorization = req.headers.get('Authorization')

  if (!authorization) {
    return NextResponse.json(
      { error: { message: 'Authorization key could not be verified' } },
      { status: 401 },
    )
  }

  const decodedData = await authHelper.decrypt(authorization)

  if (!decodedData) {
    return NextResponse.json({ error: { message: 'Invalid authorization key!' } }, { status: 403 })
  }

  return null
}
