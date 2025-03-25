import { sendEmail } from '../../../lib/email'
import { PayloadRequest } from 'payload'
import { AdminUser } from '../../../payload-types'
import { getMsdsRequestCreatedTemplate } from '../emailTemplates/msdsRequestCreatedTemplate'

interface Response {
  message: string
  respondedBy: string | number | AdminUser
  respondedAt: string | null
  id?: string | null
}

interface EmailConfig {
  to: string
  subject: string
  text: string
  html?: string
  attachments?: {
    filename: string
    path: string
    contentType?: string
  }[]
}

// Exported for use in email template
export const statusMap = {
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
        // Use the template from external file
        const emailHTML = getMsdsRequestCreatedTemplate({
          productName: doc.productName,
          companyName: company?.companyName,
          requestedByEmail: requestedBy?.email,
          description: doc.description,
          status: doc.status,
          id: doc.id,
          apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
        })

        const emailConfig: EmailConfig = {
          to: admin.email,
          subject: '🔔 New MSDS Request Needs Review',
          text: `New MSDS Request for ${doc.productName}`,
          html: emailHTML,
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
