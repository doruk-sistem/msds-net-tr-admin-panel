import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config() // .env dosyasını yükle

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
})

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log('Email gönderiliyor...', { to, subject })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html: html || text, // HTML yoksa text'i kullan
    })

    console.log('Email başarıyla gönderildi:', info.response)
    return true
  } catch (error) {
    console.error('Email gönderimi sırasında hata:', error)
    return false
  }
}
