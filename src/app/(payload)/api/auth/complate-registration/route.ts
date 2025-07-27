import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
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
      return NextResponse.json({ error: { message: 'Invalid user' } }, { status: 401 })
    }

    await payload.update({
      collection: 'companyUsers',
      id: user.id,
      data: {
        hashedPassword: await bcrypt.hash(password, 10),
        registrationCompleted: true,
        emailVerified: true,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('ERROR: ', error)

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
