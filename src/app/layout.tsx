import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Providers from '@/components/provider/Provider'
import { paperlogy } from '@/fonts/Paperlogy'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '모두하나대축제 2025',
  description: '가족과 함께하는 특별한 축제',
  verification: {
    google: '_cI5ZIBfaJdYeR_VdYAxv6htziH9akh2S1JZaXWT-0E',
    other: {
      'naver-site-verification': '1471d6b4b4ff9f6ec82d54b4ed4f0af70a262871',
    },
  },
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
      <body className="min-h-screen bg-background font-noto-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
