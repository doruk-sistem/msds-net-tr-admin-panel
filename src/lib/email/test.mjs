import { sendEmail } from './index.mjs'

const testEmail = async () => {
  try {
    console.log('Email testi başlıyor...')
    
    const result = await sendEmail({
      to: 'kullanicisahte50@gmail.com',
      subject: 'Test Email',
      text: 'Bu bir test emailidir.'
    })
    
    console.log('Test sonucu:', result)
  } catch (error) {
    console.error('Test hatası:', error)
  }
}

testEmail()