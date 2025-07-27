import { NextResponse } from 'next/server'
import authHelper from '@/utilities/authHelper'
import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json()

    if (!email || !userId) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const payload = await getPayloadCMS()

    // Seçilen kullanıcıyı bul
    const user = await payload.findByID({
      collection: 'companyUsers',
      id: userId,
      depth: 1,
    })

    if (!user || user.email !== email) {
      return NextResponse.json({ error: { message: 'Invalid user' } }, { status: 401 })
    }

    // Kullanıcı zaten login sırasında doğrulanmış, şifre kontrolü yapmaya gerek yok
    // JWT token oluştur

    // Kullanıcıyı lastActiveAt ile güncelle
    await payload.update({
      collection: 'companyUsers',
      id: user.id,
      data: { lastActiveAt: new Date().toISOString() },
    })

    const { accessToken, refreshToken } = await authHelper.encrypt({
      userId: user.id,
    })

    delete user.hashedPassword
    delete user.apiKey

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
        user,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            `token=${accessToken}; Path=/; HttpOnly; SameSite=Strict`,
            `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
          ].join(', '),
        },
      },
    )
  } catch (error) {
    console.error('SELECT COMPANY ERROR: ', error)

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
