import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { Toaster } from '@/components/ui/toaster'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import { Providers } from '@/providers'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Modern admin panel built with Next.js',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <LivePreviewListener />

            {children}
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
