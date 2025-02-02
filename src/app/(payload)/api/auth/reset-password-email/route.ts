import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

import getPayloadCMS from '@/utilities/getPayloadCMS'
import { getServerSideURL } from '@/utilities/getURL'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const payload = await getPayloadCMS()

    // Kullanıcıyı bul
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
      return NextResponse.json({ error: { message: 'User not found' } }, { status: 404 })
    }

    // Create JWT token (1 hour valid)
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.RESET_PASSWORD_SECRET!,
      { expiresIn: '1h' },
    )

    // Send email
    await payload.sendEmail({
      from: '"MSDS System" <info@doruksistem.com.tr>',
      to: email,
      subject: 'MSDS System - Reset Password',
      text: `${email}, please reset your password.`,
      html: `
          <b>Hello ${email}, your password reset request has been received.</b>
          <br />
          <p>Please click the link below to reset your password.</p>
          <br />
          <br />
          <a href="${getServerSideURL()}/auth/reset-password?token=${resetToken}" target="_blank">Click here to reset your password</a>
          <br />
          <p>This link is valid for <b>1 hour</b>.</p>
        `,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('ERROR: ', error)
    return NextResponse.json({ error: { message: 'Internal server error' } }, { status: 500 })
  }
}
