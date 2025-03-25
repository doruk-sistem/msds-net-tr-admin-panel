import { statusMap } from '../hooks/sendNotifications'

interface MsdsRequestTemplateProps {
  productName: string
  companyName?: string
  requestedByEmail?: string
  description: string
  status: string
  id: string
  apiUrl: string
}

export const getMsdsRequestCreatedTemplate = (props: MsdsRequestTemplateProps): string => {
  const { productName, companyName, requestedByEmail, description, status, id, apiUrl } = props

  // Determine status color based on current status
  const statusColor =
    status === 'pending' ? '#f59e0b' : status === 'inProgress' ? '#3b82f6' : '#10b981'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
    <!-- Main Card -->
    <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #2563eb; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New MSDS Request 🔔</h1>
        <span style="
          display: inline-block;
          margin-top: 8px;
          padding: 4px 12px;
          background-color: ${statusColor};
          color: white;
          border-radius: 9999px;
          font-size: 14px;">
          ${statusMap[status]?.en}
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
            <span style="color: #6b7280; margin-left: 8px;">${productName}</span>
          </div>
          
          <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151;">Company:</strong>
            <span style="color: #6b7280; margin-left: 8px;">${companyName || 'N/A'}</span>
          </div>
          
          <div style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151;">Requested By:</strong>
            <span style="color: #6b7280; margin-left: 8px;">${requestedByEmail || 'N/A'}</span>
          </div>
          
          <div style="padding: 12px;">
            <strong style="color: #374151;">Description:</strong>
            <span style="color: #6b7280; margin-left: 8px;">${description}</span>
          </div>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin-top: 32px;">
          <a href="${apiUrl}/admin/collections/msdsRequestsV2/${id}" 
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
</html>`
}
