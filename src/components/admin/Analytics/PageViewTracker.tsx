// src/components/analytics/PageViewTracker.tsx
'use client'

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gtag_pageview, track_page_events, isGA4Enabled, gtag_event } from '@/lib/ga4/gtag';

// NextJS 15: App Router의 라우트 변경 감지하여 자동 페이지뷰 트래킹
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGA4Enabled()) return;

    // URL 구성
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // 페이지 제목 감지
    const pageTitle = document.title;
    
    // GA4 페이지뷰 전송
    gtag_pageview(url, pageTitle);
    
    // 특정 페이지별 커스텀 이벤트 전송
    trackPageSpecificEvents(pathname);
    
  }, [pathname, searchParams]);

  return null; // UI를 렌더링하지 않는 트래킹 전용 컴포넌트
}

// 페이지별 특정 이벤트 트래킹
function trackPageSpecificEvents(pathname: string) {
  try {
    // 메인 페이지
    if (pathname === '/') {
      track_page_events.home_visit();
      gtag_event('page_view', 'main', 'homepage');
    }
    
    // 축제 정보 페이지들
    else if (pathname === '/about') {
      gtag_event('page_view', 'festival_info', 'about');
      gtag_event('content_view', 'festival', 'festival_introduction');
    }
    else if (pathname === '/organization') {
      gtag_event('page_view', 'festival_info', 'organization');
      gtag_event('content_view', 'festival', 'organization_info');
    }
    else if (pathname === '/programs') {
      gtag_event('page_view', 'festival_info', 'programs');
      gtag_event('content_view', 'festival', 'event_programs');
    }
    else if (pathname === '/directions') {
      gtag_event('page_view', 'festival_info', 'directions');
      gtag_event('content_view', 'location', 'venue_directions');
    }
    else if (pathname === '/partners') {
      gtag_event('page_view', 'festival_info', 'partners');
      gtag_event('content_view', 'festival', 'partner_organizations');
    }
    
    // 온라인 축제
    else if (pathname === '/online-festival') {
      track_page_events.event_visit('online');
      gtag_event('page_view', 'online_event', 'main');
      gtag_event('content_view', 'online_festival', 'main_page');
    }
    
    // 공지/소식
    else if (pathname === '/news') {
      gtag_event('page_view', 'information', 'news_list');
      gtag_event('content_view', 'news', 'news_main');
    }
    else if (pathname.startsWith('/news/')) {
      const newsId = pathname.split('/')[2];
      track_page_events.news_view(newsId);
      gtag_event('content_view', 'news', `news_detail_${newsId}`);
    }
    
    // 인증 관련 페이지
    else if (pathname === '/login') {
      track_page_events.login_visit();
      gtag_event('page_view', 'auth', 'login');
    }
    else if (pathname === '/register') {
      track_page_events.signup_visit();
      gtag_event('page_view', 'auth', 'register');
    }
    else if (pathname === '/forgot-password') {
      gtag_event('page_view', 'auth', 'forgot_password');
    }
    
    // 마이페이지
    else if (pathname === '/my-page') {
      track_page_events.mypage_visit();
      gtag_event('page_view', 'user', 'mypage_main');
    }
    else if (pathname.startsWith('/my-page/')) {
      track_page_events.mypage_visit();
      
      // 마이페이지 하위 경로별 세부 트래킹
      if (pathname === '/my-page/delete-account') {
        gtag_event('page_view', 'user', 'delete_account');
      }
      else if (pathname === '/my-page/change-password') {
        gtag_event('page_view', 'user', 'change_password');
      }
      else if (pathname === '/my-page/edit-profile') {
        gtag_event('page_view', 'user', 'edit_profile');
      }
      else {
        const subPath = pathname.split('/')[2];
        gtag_event('page_view', 'user', `mypage_${subPath}`);
      }
    }
    
    // 온라인 축제 하위 페이지들
    else if (pathname.startsWith('/online-festival/')) {
      const eventType = pathname.split('/')[2] || 'general';
      track_page_events.event_visit(eventType);
      gtag_event('page_view', 'online_event', eventType);
    }
    
    // 프로그램 상세 페이지
    else if (pathname.startsWith('/programs/')) {
      const programId = pathname.split('/')[2];
      gtag_event('content_view', 'program', `program_${programId}`);
    }
    
    // 404 또는 기타 페이지
    else if (pathname === '/404' || pathname === '/not-found') {
      gtag_event('page_view', 'error', '404_not_found');
    }
    else if (pathname === '/500') {
      gtag_event('page_view', 'error', '500_server_error');
    }
    
    // 기타 페이지는 일반 페이지뷰로 처리
    else {
      // 페이지 카테고리 추출 (첫 번째 경로 세그먼트)
      const category = pathname.split('/')[1] || 'other';
      gtag_event('page_view', 'general', category);
    }
    
  } catch (error) {
    console.error('페이지별 이벤트 트래킹 오류:', error);
  }
}

// 페이지 카테고리 매핑
export const PAGE_CATEGORIES = {
  '/': 'main',
  '/about': 'festival_info',
  '/organization': 'festival_info', 
  '/online-festival': 'online_event',
  '/programs': 'festival_info',
  '/news': 'information',
  '/directions': 'festival_info',
  '/partners': 'festival_info',
  '/login': 'auth',
  '/register': 'auth',
  '/my-page': 'user'
} as const;

// 페이지 우선순위 (중요도)
export const PAGE_PRIORITY = {
  '/': 'high',
  '/online-festival': 'high',
  '/programs': 'high',
  '/about': 'medium',
  '/news': 'medium',
  '/login': 'medium',
  '/register': 'medium',
  '/my-page': 'medium',
  '/organization': 'low',
  '/directions': 'low', 
  '/partners': 'low'
} as const;