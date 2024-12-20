import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import authHelper from '@/utilities/authHelper'
import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email && !password) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const payload = await getPayloadCMS()

    const users = await payload.find({
      depth: 0,
      collection: 'companyUsers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    const user = users?.docs[0]

    if (!user) {
      return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 })
    }

    const isValid =
      password && user.hashedPassword ? await bcrypt.compare(password, user.hashedPassword) : false

    if (!isValid) {
      return NextResponse.json({ error: { message: 'Invalid password' } }, { status: 401 })
    }

    const { accessToken, refreshToken } = await authHelper.encrypt({
      userId: user.id,
    })

    delete user.hashedPassword
    delete user.apiKey

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
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
    console.error('LOGIN ERROR: ', error)

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
