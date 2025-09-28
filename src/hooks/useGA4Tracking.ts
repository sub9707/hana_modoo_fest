// src/hooks/useGA4Tracking.ts
'use client'

import { useCallback } from 'react';
import { 
  gtag_event, 
  gtag_track_conversion, 
  gtag_set_user_properties,
  track_page_events,
  isGA4Enabled 
} from '@/lib/ga4/gtag';

// NextJS 15: GA4 이벤트 트래킹을 위한 커스텀 훅
export function useGA4Tracking() {
  
  // 일반 이벤트 트래킹
  const trackEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (!isGA4Enabled()) return;
    gtag_event(action, category, label, value);
  }, []);

  // 버튼 클릭 트래킹
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    track_page_events.button_click(buttonName, location);
  }, []);

  // 폼 제출 트래킹
  const trackFormSubmit = useCallback((formType: string) => {
    track_page_events.form_submit(formType);
  }, []);

  // 콘텐츠 조회 트래킹
  const trackContentView = useCallback((contentType: string, contentId?: string) => {
    gtag_event('content_view', contentType, contentId);
  }, []);

  // 다운로드 트래킹
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    gtag_event('file_download', 'download', `${fileType}_${fileName}`);
  }, []);

  // 외부 링크 클릭 트래킹
  const trackExternalLink = useCallback((url: string, linkText?: string) => {
    gtag_event('click', 'external_link', linkText || url);
  }, []);

  // 사용자 등록/로그인 트래킹
  const trackUserAction = useCallback((action: 'signup' | 'login' | 'logout', method?: string) => {
    gtag_event(action, 'user_action', method);
  }, []);

  // 이벤트 참여 트래킹
  const trackEventParticipation = useCallback((eventType: string, eventId?: string) => {
    gtag_track_conversion('event_participation', {
      event_type: eventType,
      event_id: eventId,
      currency: 'KRW',
      value: 0
    });
  }, []);

  // 공지사항 조회 트래킹
  const trackNewsView = useCallback((newsId: string, category?: string) => {
    track_page_events.news_view(newsId);
    if (category) {
      gtag_event('content_view', 'news', `${category}_${newsId}`);
    }
  }, []);

  // 검색 트래킹
  const trackSearch = useCallback((searchTerm: string, resultCount?: number) => {
    gtag_event('search', 'site_search', searchTerm, resultCount);
  }, []);

  // 스크롤 깊이 트래킹
  const trackScrollDepth = useCallback((percentage: number, pagePath?: string) => {
    gtag_event('scroll', 'engagement', `${percentage}%_${pagePath || 'unknown'}`);
  }, []);

  // 사용자 속성 설정
  const setUserProperties = useCallback((properties: Record<string, string>) => {
    gtag_set_user_properties(properties);
  }, []);

  // 커스텀 전환 이벤트
  const trackConversion = useCallback((
    conversionName: string, 
    value?: number, 
    currency: string = 'KRW'
  ) => {
    gtag_track_conversion(conversionName, {
      value,
      currency
    });
  }, []);

  // GA4 활성화 상태 확인
  const isEnabled = useCallback(() => {
    return isGA4Enabled();
  }, []);

  return {
    // 기본 트래킹
    trackEvent,
    trackButtonClick,
    trackFormSubmit,
    trackContentView,
    trackDownload,
    trackExternalLink,
    
    // 사용자 액션
    trackUserAction,
    trackEventParticipation,
    trackNewsView,
    trackSearch,
    trackScrollDepth,
    
    // 고급 기능
    setUserProperties,
    trackConversion,
    
    // 유틸리티
    isEnabled
  };
}

// 사용 예시를 위한 타입 정의
export interface TrackingEventData {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// 공통 이벤트 상수
export const TRACKING_EVENTS = {
  // 네비게이션
  MENU_CLICK: 'menu_click',
  PAGE_VIEW: 'page_view',
  
  // 사용자 액션
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',
  
  // 콘텐츠
  CONTENT_VIEW: 'content_view',
  FILE_DOWNLOAD: 'file_download',
  SEARCH: 'search',
  
  // 참여
  EVENT_PARTICIPATION: 'event_participation',
  REGISTRATION: 'registration',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  
  // 소셜
  SHARE: 'share',
  LIKE: 'like',
  COMMENT: 'comment'
} as const;

export const TRACKING_CATEGORIES = {
  NAVIGATION: 'navigation',
  USER_ACTION: 'user_action',
  CONTENT: 'content',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  ERROR: 'error'
} as const;