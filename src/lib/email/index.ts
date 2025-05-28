import nodemailer from 'nodemailer'

// Email transport yapılandırması
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail için özel ayar
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS için false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // SSL/TLS hatalarını önlemek için
  },
  debug: true, // Debug modunu aç
})

// Test connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Bağlantı hatası:', error)
  } else {
    console.log('SMTP Sunucusuna bağlantı başarılı!')
  }
})

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text: string
  html?: string
}) => {
  try {
    console.log('Email gönderiliyor...', { to, subject }) // Debug log

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html: html || text, // HTML yoksa text'i kullan
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('Email başarıyla gönderildi:', info.response) // Debug log
    return true
  } catch (error) {
    console.error('Email gönderimi sırasında hata:', error) // Hata detayı
    return false
  }
}
