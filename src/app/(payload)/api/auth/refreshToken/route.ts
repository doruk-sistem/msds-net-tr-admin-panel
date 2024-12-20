import { NextRequest, NextResponse } from 'next/server'

import authHelper from '@/utilities/authHelper'

export async function POST(request: NextRequest) {
  try {
    const newTokens = await authHelper.updateSessionWithRequest(request)

    if (!newTokens) {
      return NextResponse.json({ error: { message: 'Refresh token has expired' } }, { status: 401 })
    }

    return NextResponse.json(
      {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            `token=${newTokens.accessToken}; Path=/; HttpOnly; SameSite=Strict`,
            `refreshToken=${newTokens.refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
          ].join(', '),
        },
      },
    )
  } catch (error) {
    console.error('REFRESH TOKEN ERROR: ', error)

    return NextResponse.json(
      {
        error: {
          message: 'Internal server error',
        },
      },
      { status: 500 },
    )
  }
}
