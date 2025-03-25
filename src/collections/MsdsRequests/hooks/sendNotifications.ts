import { sendEmail } from '../../../lib/email'
import { PayloadRequest } from 'payload'
import { AdminUser } from '../../../payload-types'

interface EmailConfig {
  to: string
  subject: string
  text: string
  attachments?: {
    filename: string
    path: string
    contentType?: string
  }[]
}

const statusMap = {
  pending: { en: 'Pending', tr: 'Beklemede' },
  inProgress: { en: 'In Progress', tr: 'İşleme Alındı' },
  completed: { en: 'Completed', tr: 'Tamamlandı' },
}

export const sendNotifications = async ({
  req,
  doc,
  operation,
}: {
  req: PayloadRequest
  doc: any
  operation: 'create' | 'update'
}) => {
  try {
    if (operation === 'create') {
      // Admin kullanıcıları al
      const admins = await req.payload.find({
        collection: 'adminUsers',
        depth: 0,
      })

      // Şirket ve kullanıcı bilgilerini al
      let company = doc.company
      let requestedBy = doc.requestedBy

      if (typeof company === 'string') {
        company = await req.payload.findByID({
          collection: 'companies',
          id: company,
        })
      }

      if (typeof requestedBy === 'string') {
        requestedBy = await req.payload.findByID({
          collection: 'companyUsers',
          id: requestedBy,
        })
      }

      // Her admin için mail gönder
      for (const admin of admins.docs as AdminUser[]) {
        const emailText = `
          Dear Admin,

          A new MSDS Request has been created and needs your review.

          Request Details:
          Product: ${doc.productName}
          Company: ${company?.companyName}
          Requested By: ${requestedBy?.email}
          Description: ${doc.description}
          Status: ${statusMap[doc.status]?.en}

          You can review this request and access the uploaded file at:
          ${process.env.NEXT_PUBLIC_API_URL}/admin/collections/msdsRequests/${doc.id}

          Best regards,
          MSDS System
        `

        const emailConfig: EmailConfig = {
          to: admin.email,
          subject: 'New MSDS Request Needs Review',
          text: emailText,
        }

        try {
          await sendEmail(emailConfig)
        } catch (error) {
          console.error('Error sending email:', error)
        }
      }
    }

    return doc
  } catch (error) {
    console.error('Hook error:', error)
    return doc
  }
}

export default sendNotifications
