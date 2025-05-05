import { CollectionConfig, Where } from 'payload'
import { sendNotifications } from './hooks/sendNotifications'  

const MsdsRequests: CollectionConfig = {
  slug: 'msdsRequests',
  access: {
    read: () => true, 
    create: () => true,
    update: () => true, 
  },
  labels: {
    singular: {
      tr: 'MSDS Talebi',
      en: 'MSDS Request'
    },
    plural: {
      tr: 'MSDS Talepleri',
      en: 'MSDS Requests'
    }
  },
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'company', 'status', 'createdAt'],
    description: {
      tr: 'MSDS taleplerini yönetmek için kullanılır.',
      en: 'Used to manage MSDS requests.'
    },
    hidden: true,
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
      label: {
        tr: 'Ürün Adı',
        en: 'Product Name'
      }
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: {
        tr: 'Şirket',
        en: 'Company'
      },
    },
    {
        name: 'status',
        type: 'select',
        required: true,
        defaultValue: 'pending',
        label: {
          en: 'Status',
          tr: 'Durum'
        },
        options: [
          {
            label: {
              en: 'Pending',
              tr: 'Beklemede'
            },
            value: 'pending'
          },
          {
            label: {
              en: 'In Progress',
              tr: 'İşleme Alındı'
            },
            value: 'inProgress'
          },
          {
            label: {
              en: 'Completed',
              tr: 'Tamamlandı'
            },
            value: 'completed'
          }
        ]
      },
      {
        name: 'sdsFile',
        type: 'upload',
        relationTo: 'fileMedia',
        filterOptions: {
          mimeType: { 
            in: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
          }
        },
        label: {
          en: 'SDS File',
          tr: 'SDS Dosyası'
        }
      },
    {
        name: 'requestedBy',
        type: 'relationship',
        relationTo: 'companyUsers',
        required: true,
        label: {
          en: 'Requested By',
          tr: 'Talep Eden'
        },
        filterOptions: ({ data }): Where => ({
          and: [
            {
              company: {
                equals: data?.company || ''
              }
            }
          ]
        })
      },
      
{
    name: 'responses',
    type: 'array',
    label: {
      en: 'Responses',
      tr: 'Cevaplar'
    },
    admin: {
      initCollapsed: false
    },
    fields: [
      {
        name: 'message',
        type: 'textarea',
        label: {
          en: 'Message',
          tr: 'Mesaj'
        },
        required: true
      },
      {
        name: 'respondedBy',
        type: 'relationship',
        relationTo: 'adminUsers',
        required: true,
        admin: {
          readOnly: true,
          position: 'sidebar'
        }
      },
      {
        name: 'respondedAt',
        type: 'date',
        admin: {
          readOnly: true,
          position: 'sidebar'
        }
      }
    ]
  },
    {
      name: 'description',
      type: 'textarea',
      label: {
        tr: 'Açıklama',
        en: 'Description'
      }
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar'
      },
      label: {
        tr: 'Oluşturulma Tarihi',
        en: 'Created At'
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === 'create') {
              return new Date().toISOString()
            }
          }
        ],
      }
    }
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (data.responses?.length > 0) {
          const latestResponse = data.responses[data.responses.length - 1]
          if (!latestResponse.respondedBy && req.user) {
            latestResponse.respondedBy = req.user.id
            latestResponse.respondedAt = new Date().toISOString()
          }
        }
        return data
      }
    ],
    afterChange: [sendNotifications]
  }
}


export default MsdsRequests