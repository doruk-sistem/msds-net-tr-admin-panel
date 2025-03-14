import { CollectionConfig } from 'payload'
import path from 'path'

const FileMedia: CollectionConfig = {
  slug: 'fileMedia',
  admin: {
    useAsTitle: 'filename',
    group: 'Media',
    description: {
      en: 'Upload and manage SDS files',
      tr: 'SDS dosyalarını yükleyin ve yönetin'
    }
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../../../public/files'),
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: {
        en: 'Alt Text',
        tr: 'Alt Metin'
      }
    },
    {
      name: 'caption',
      type: 'text',
      label: {
        en: 'Caption',
        tr: 'Başlık'
      }
    }
  ],
  access: {
    read: () => true,    // Herkes okuyabilir
    create: () => true,  // Herkes yükleyebilir
    update: () => true,  // Herkes güncelleyebilir
    delete: () => true,  // Herkes silebilir
  }
}

export default FileMedia