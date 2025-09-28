// src/components/analytics/GA4Script.tsx
'use client'

import Script from 'next/script';
import { GA4_TRACKING_ID } from '@/lib/ga4/gtag';

// NextJS 15: Script 컴포넌트로 GA4 최적화 로딩
export function GA4Script() {
  // GA4 ID가 없거나 개발환경에서는 비활성화
  if (!GA4_TRACKING_ID) {
    console.warn('GA4_TRACKING_ID가 설정되지 않았습니다. GA4 트래킹이 비활성화됩니다.');
    return null;
  }

  // 개발환경에서 트래킹 비활성화 (선택사항)
  if (process.env.NODE_ENV === 'development') {
    console.log('개발환경에서 GA4 트래킹 활성화됨. GA4_TRACKING_ID:', GA4_TRACKING_ID);
  }

  return (
    <>
      {/* Google Analytics 4 스크립트 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_TRACKING_ID}`}
        strategy="afterInteractive"
        id="ga4-script"
      />
      
      {/* GA4 초기화 스크립트 */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA4_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              // 개인정보보호 설정
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
            
            console.log('GA4 초기화 완료:', '${GA4_TRACKING_ID}');
          `,
        }}
      />
    </>
  );
}