import 'dotenv/config'

// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

import { tr } from 'payload/i18n/tr'
import { en } from 'payload/i18n/en'

// import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
// import { redirectsPlugin } from '@payloadcms/plugin-redirects'
// import { searchPlugin } from '@payloadcms/plugin-search'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

// import { seedHandler } from './endpoints/seedHandler'

// import { revalidateRedirects } from './hooks/revalidateRedirects'
// import { Footer } from './Footer/config'
// import { Header } from './Header/config'

// import { searchFields } from '@/search/fieldOverrides'
// import { beforeSyncWithSearch } from '@/search/beforeSync'

// import Categories from './collections/Categories'
// import { Pages } from './collections/Pages'
// import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import AdminUsers from './collections/AdminUsers'
import CompanyUsers from './collections/CompanyUsers'
import MSDS from './collections/MSDS'
import Companies from './collections/Companies'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins: any = [
  // redirectsPlugin({
  //   collections: ['pages', 'posts'],
  //   overrides: {
  //     // @ts-expect-error
  //     fields: ({ defaultFields }) => {
  //       return defaultFields.map((field) => {
  //         if ('name' in field && field.name === 'from') {
  //           return {
  //             ...field,
  //             admin: {
  //               description: 'You will need to rebuild the website when changing this field.',
  //             },
  //           }
  //         }
  //         return field
  //       })
  //     },
  //     hooks: {
  //       afterChange: [revalidateRedirects],
  //     },
  //   },
  // }),
  // nestedDocsPlugin({
  //   collections: ['categories'],
  // }),
  // formBuilderPlugin({
  //   fields: {
  //     payment: false,
  //   },
  //   formOverrides: {
  //     fields: ({ defaultFields }) => {
  //       return defaultFields.map((field) => {
  //         if ('name' in field && field.name === 'confirmationMessage') {
  //           return {
  //             ...field,
  //             editor: lexicalEditor({
  //               features: ({ rootFeatures }) => {
  //                 return [
  //                   ...rootFeatures,
  //                   FixedToolbarFeature(),
  //                   HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
  //                 ]
  //               },
  //             }),
  //           }
  //         }
  //         return field
  //       })
  //     },
  //   },
  // }),
  // searchPlugin({
  //   collections: ['posts'],
  //   beforeSync: beforeSyncWithSearch,
  //   searchOverrides: {
  //     fields: ({ defaultFields }) => {
  //       return [...defaultFields, ...searchFields]
  //     },
  //   },
  // }),
]

if (process.env.BLOB_READ_WRITE_TOKEN) {
  const vercelBlob = vercelBlobStorage({
    collections: {
      media: true,
      msds: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  })

  plugins.push(vercelBlob)
}

export default buildConfig({
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
  db:
    process.env.NODE_ENV === 'development'
      ? postgresAdapter({
          pool: {
            connectionString: process.env.DATABASE_URL || '',
          },
        })
      : vercelPostgresAdapter({
          pool: {
            connectionString: process.env.DATABASE_URL || '',
          },
        }),
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.DATABASE_URL || '',
  //   },
  // }),
  // collections: [Pages, Posts, Media, Categories, AdminUsers, CompanyUsers, Companies, MSDS],
  collections: [Media, AdminUsers, CompanyUsers, Companies, MSDS],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  // endpoints: [
  //   // The seed endpoint is used to populate the database with some example data
  //   // You should delete this endpoint before deploying your site to production
  //   {
  //     handler: seedHandler,
  //     method: 'get',
  //     path: '/seed',
  //   },
  // ],
  // globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
