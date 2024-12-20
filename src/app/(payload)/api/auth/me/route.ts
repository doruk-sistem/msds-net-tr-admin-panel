import { NextRequest, NextResponse } from 'next/server'

import validateAuthorization from '@/utilities/validate-authorization'
import getMe from '@/utilities/getMe'

export async function GET(req: NextRequest) {
  try {
    const isInvalid = await validateAuthorization(req)
    if (!!isInvalid) {
      return isInvalid
    }

    const user = await getMe()

    if (!user) {
      return NextResponse.json(
        {
          error: {
            message: 'User not found.',
          },
        },
        { status: 404 },
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch {
    return NextResponse.json({ error: { message: 'Internal server error' } }, { status: 500 })
  }
}
