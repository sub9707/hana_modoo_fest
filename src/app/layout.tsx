import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Providers from '@/components/provider/Provider'
import { paperlogy } from '@/fonts/Paperlogy'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '700'],
  preload: true,
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  weight: ['400', '700'],
  preload: true,
})

export const metadata: Metadata = {
  title: '모두하나대축제 2025',
  description: '가족과 함께하는 특별한 축제',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${notoSansKR.variable} ${paperlogy.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://dapi.kakao.com" />
      </head>
      <body className="min-h-screen bg-background font-noto-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
