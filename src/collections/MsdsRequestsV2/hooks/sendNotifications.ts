import { Company } from '@/payload-types'
import { sendEmail } from '../../../lib/email'
import { PayloadRequest } from 'payload'
import { CompanyUser, AdminUser } from '../../../payload-types'

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
        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
            <!-- Ana Kart -->
            <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background-color: #2563eb; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New MSDS Request 🔔</h1>
                <span style="
                  display: inline-block;
                  margin-top: 8px;
                  padding: 4px 12px;
                  background-color: ${
                    doc.status === 'pending'
                      ? '#f59e0b'
                      : doc.status === 'inProgress'
                        ? '#3b82f6'
                        : '#10b981'
                  };
                  color: white;
                  border-radius: 9999px;
                  font-size: 14px;">
                  ${statusMap[doc.status]?.en}
                </span>
              </div>
        
              <!-- Content -->
              <div style="padding: 24px;">
                <p style="color: #4b5563; margin-bottom: 24px;">
                  Dear Admin, a new MSDS Request has been created and needs your review.
                </p>
        
                <!-- Details Grid -->
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Product:</strong>
                    <span style="color: #6b7280; margin-left: 8px;">${doc.productName}</span>
                  </div>
                  
                  <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Company:</strong>
                    <span style="color: #6b7280; margin-left: 8px;">${company?.companyName}</span>
                  </div>
                  
                  <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Requested By:</strong>
                    <span style="color: #6b7280; margin-left: 8px;">${requestedBy?.email}</span>
                  </div>
                  
                  <div style="padding: 12px;">
                    <strong style="color: #374151;">Description:</strong>
                    <span style="color: #6b7280; margin-left: 8px;">${doc.description}</span>
                  </div>
                </div>
        
              <!-- Action Button -->
              <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.NEXT_PUBLIC_API_URL}/admin/collections/msdsRequestsV2/${doc.id}"
              style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Review Request
              </a>
              </div>
              </div>
        
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 16px; text-align: center; margin-top: 24px;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  This is an automated message from the MSDS System
                </p>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">
                  © ${new Date().getFullYear()} MSDS System. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
                `

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
