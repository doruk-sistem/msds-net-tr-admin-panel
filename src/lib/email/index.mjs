import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()  // .env dosyasını yükle

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log('Email gönderiliyor...', { to, subject })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html
    })

    console.log('Email başarıyla gönderildi:', info.response)
    return true
  } catch (error) {
    console.error('Email gönderimi sırasında hata:', error)
    return false
  }
}