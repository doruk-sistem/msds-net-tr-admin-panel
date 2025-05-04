import { CollectionConfig } from 'payload'
import path from 'path'

const FileMedia: CollectionConfig = {
  slug: 'fileMedia',
  admin: {
    useAsTitle: 'filename',
    group: 'Media',
    description: {
      en: 'Upload and manage SDS files',
      tr: 'SDS dosyalarını yükleyin ve yönetin',
    },
    hidden: true,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/uploads/files'),
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    filesRequiredOnCreate: true,
    disableLocalStorage: false,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: {
        en: 'Alt Text',
        tr: 'Alt Metin',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: {
        en: 'Caption',
        tr: 'Başlık',
      },
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
}

export default FileMedia
