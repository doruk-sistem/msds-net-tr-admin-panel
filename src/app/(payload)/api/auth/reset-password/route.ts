import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(request: Request) {
  try {
    const { password, token } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!)
    } catch (error) {
      return NextResponse.json({ error: { message: 'Invalid or expired token' } }, { status: 401 })
    }

    const payload = await getPayloadCMS()

    // Kullanıcıyı doğrula
    const user = await payload.findByID({
      collection: 'companyUsers',
      id: decodedToken.userId,
    })

    if (!user) {
      return NextResponse.json({ error: { message: 'User not found' } }, { status: 404 })
    }

    // Parolayı güncelle
    await payload.update({
      collection: 'companyUsers',
      id: user.id,
      data: {
        hashedPassword: await bcrypt.hash(password, 10),
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('ERROR: ', error)
    return NextResponse.json({ error: { message: 'Internal server error' } }, { status: 500 })
  }
}
