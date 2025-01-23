import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

import { EmailTemplate } from './email-template'
import getPayloadCMS from '@/utilities/getPayloadCMS'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  // const body: { recipient: string } = await request.json()

  // if (!body.recipient) {
  //   return NextResponse.json({ error: 'Recipient is required' }, { status: 400 })
  // }

  // const { recipient } = body

  try {
    // const { data, error } = await resend.emails.send({
    //   from: 'MSDS System <onboarding@resend.dev>',
    //   to: [recipient],
    //   subject: 'Hello world',
    //   react: EmailTemplate({ firstName: 'John' }),
    // })

    const payload = await getPayloadCMS()

    const email = await payload.sendEmail({
      from: '"Sender Name" <info@doruksistem.com.tr>',
      to: 'okan.unal@doruksistem.com.tr',
      subject: 'Hello from Node.js',
      text: 'Hello world!',
      html: '<b>Hello world!</b>',
    })

    console.log('email: ', email)

    // if (error) {
    //   return Response.json({ error }, { status: 500 })
    // }

    return Response.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.log('error: ', error)

    return Response.json({ error }, { status: 500 })
  }
}
