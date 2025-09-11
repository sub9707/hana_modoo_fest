import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import QuickBar from '@/components/layout/QuickBar'
import Script from 'next/script'
import Providers from '@/components/provider/Provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: '모두하나대축제 2025 | 서울시 대표 가족축제',
    template: '%s | 모두하나대축제 2025'
  },
  description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장. 2025년 10월 18일 여의도공원에서 만나요.',
  keywords: ['모두하나대축제', '서울시', '가족축제', '한부모가족', '가족다양성', '여의도공원'],
  authors: [{ name: '서울특별시한부모가족지원센터' }],
  creator: '서울특별시한부모가족지원센터',
  publisher: '서울특별시',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://moduhana2025.seoul.kr',
    title: '모두하나대축제 2025 | 서울시 대표 가족축제',
    description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
    siteName: '모두하나대축제',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '모두하나대축제 2025 포스터',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '모두하나대축제 2025 | 서울시 대표 가족축제',
    description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable}`}>
      <body className="min-h-screen bg-background font-noto-sans antialiased">
        <Providers>
        {/* Google Analytics */}
        {/*<Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_TRACKING_ID');
          `}
        </Script>*/}
        
        {/* 메인 레이아웃 */}
        <div className="flex min-h-screen flex-col">
          <Header />
          
          <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
            {children}
          </main>
          
          <Footer />
        </div>

        {/* 모바일 퀵바 */}
        <QuickBar />
        
        {/* 맨 위로 버튼 */}

        {/* 구조화 데이터 */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "모두하나대축제 2025",
              "description": "서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.",
              "startDate": "2025-10-18T11:00:00+09:00",
              "endDate": "2025-10-18T16:00:00+09:00",
              "location": {
                "@type": "Place",
                "name": "여의도공원 문화의마당",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "서울특별시",
                  "addressRegion": "영등포구",
                  "addressCountry": "KR"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": "서울특별시한부모가족지원센터",
                "url": "https://moduhana2025.seoul.kr"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
        </Providers>
      </body>
    </html>
  )
}