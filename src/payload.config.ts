import dotenv from 'dotenv'

// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import { tr } from 'payload/i18n/tr'
import { en } from 'payload/i18n/en'

import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import nodemailer from 'nodemailer'

import path from 'path'
import { fileURLToPath } from 'url'

import plugins from './plugins'

import collections from './collections'
import AdminUsers from './collections/AdminUsers'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({
  path: path.resolve(dirname, `../.env.${process.env.NODE_ENV}`),
})

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  email: nodemailerAdapter({
    skipVerify: true,
    defaultFromAddress: 'info@doruksistem.com.tr',
    defaultFromName: '"MSDS System" <info@doruksistem.com.tr>',
    transport: nodemailer.createTransport({
      service: 'outlook',
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
  localization: {
    locales: [
      {
        code: 'tr',
        label: 'Turkish',
      },
      {
        code: 'en',
        label: 'English',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: {
      tr,
      en,
    },
  },
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        Logo: '@/components/Logo',
        Icon: '@/components/Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: AdminUsers.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        ParagraphFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          // enabledCollections: ['pages', 'posts'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    prodMigrations: migrations,
  }),
  collections,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
  },
})
