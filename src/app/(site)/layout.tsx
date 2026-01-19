import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import QuickBar from '@/components/layout/QuickBar'
import ScrollToTop from '@/components/common/ScrollToTop'
import { SITE, FESTIVAL, DEFAULT_SEO, CONTACT } from '@/constants'

export const metadata: Metadata = {
    title: {
        default: DEFAULT_SEO.title,
        template: `%s | ${SITE.fullName}`
    },
    description: DEFAULT_SEO.description,
    keywords: [...DEFAULT_SEO.keywords],
    openGraph: {
        type: DEFAULT_SEO.type,
        locale: DEFAULT_SEO.locale,
        url: SITE.url,
        title: DEFAULT_SEO.title,
        description: DEFAULT_SEO.description,
        siteName: SITE.name,
        images: [
            {
                url: DEFAULT_SEO.ogImage,
                width: DEFAULT_SEO.ogImageWidth,
                height: DEFAULT_SEO.ogImageHeight,
                alt: DEFAULT_SEO.ogImageAlt,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: DEFAULT_SEO.title,
        description: DEFAULT_SEO.description,
        images: [DEFAULT_SEO.ogImage],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: DEFAULT_SEO.favicon,
    },
    metadataBase: new URL(SITE.url)
}

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Header />

                <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                    {children}
                    <ScrollToTop />
                </main>

                <Footer />
            </div>

            <QuickBar />

            {/* 구조화 데이터 */}
            <Script
                id="structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        "name": SITE.fullName,
                        "description": DEFAULT_SEO.description,
                        "startDate": FESTIVAL.isoStartDate,
                        "endDate": FESTIVAL.isoEndDate,
                        "location": {
                            "@type": "Place",
                            "name": FESTIVAL.location.name,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "서울특별시",
                                "addressRegion": "영등포구",
                                "addressCountry": "KR"
                            }
                        },
                        "organizer": {
                            "@type": "Organization",
                            "name": SITE.host,
                            "url": CONTACT.social.website
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
        </>
    )
}