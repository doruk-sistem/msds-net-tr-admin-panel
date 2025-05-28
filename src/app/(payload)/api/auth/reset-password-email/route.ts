import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import getPayloadCMS from '@/utilities/getPayloadCMS'
import { getServerSideURL } from '@/utilities/getURL'
import { sendEmail } from '@/lib/email'

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
    await sendEmail({
      to: email,
      subject: 'MSDS System - Reset Password',
      text: `${email}, please reset your password by clicking the link below:\n\n${getServerSideURL()}/auth/reset-password?token=${resetToken}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://msds.net.tr/msds-com-tr-logo.png" alt="MSDS System Logo" style="width: 180px;" />
          </div>
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello <strong>${email}</strong>,</p>
          <p>We received a request to reset your password. To proceed with the password reset, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${getServerSideURL()}/auth/reset-password?token=${resetToken}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">
            ${getServerSideURL()}/auth/reset-password?token=${resetToken}
          </p>
          <p>This link will expire in 1 hour.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
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
