export const GA4_TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID;

// gtag 함수 타입 정의
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        page_title?: string;
        page_location?: string;
        send_page_view?: boolean;
        custom_map?: Record<string, string>;
      } | Record<string, any>
    ) => void;
  }
}

// GA4 초기화 확인
export const isGA4Enabled = (): boolean => {
  return !!(GA4_TRACKING_ID && typeof window !== 'undefined');
};

// 페이지뷰 이벤트 전송
export const gtag_pageview = (url: string, title?: string): void => {
  if (!isGA4Enabled()) return;
  
  try {
    window.gtag('config', GA4_TRACKING_ID!, {
      page_location: url,
      page_title: title || document.title,
      send_page_view: true,
    });
    
  } catch (error) {
    console.error('GA4 페이지뷰 전송 오류:', error);
  }
};

// 커스텀 이벤트 전송
export const gtag_event = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGA4Enabled()) return;
  
  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    
  } catch (error) {
    console.error('GA4 이벤트 전송 오류:', error);
  }
};

// 특정 페이지 이벤트들
export const track_page_events = {
  // 홈페이지 방문
  home_visit: () => gtag_event('page_view', 'navigation', 'home'),
  
  // 로그인 페이지 방문
  login_visit: () => gtag_event('page_view', 'auth', 'login'),
  
  // 회원가입 페이지 방문
  signup_visit: () => gtag_event('page_view', 'auth', 'signup'),
  
  // 마이페이지 방문
  mypage_visit: () => gtag_event('page_view', 'user', 'mypage'),
  
  // 이벤트 페이지 방문
  event_visit: (eventType?: string) => 
    gtag_event('page_view', 'event', eventType || 'general'),
    
  // 공지사항 조회
  news_view: (newsId?: string) =>
    gtag_event('content_view', 'news', newsId),
    
  // 폼 제출 추적
  form_submit: (formType: string) =>
    gtag_event('form_submit', 'engagement', formType),
    
  // 버튼 클릭 추적
  button_click: (buttonName: string, location: string) =>
    gtag_event('click', 'interaction', `${location}_${buttonName}`),
};

// 사용자 속성 설정
export const gtag_set_user_properties = (properties: Record<string, string>): void => {
  if (!isGA4Enabled()) return;
  
  try {
    window.gtag('set', 'user_properties', properties);
    console.log('GA4 사용자 속성 설정:', properties);
  } catch (error) {
    console.error('GA4 사용자 속성 설정 오류:', error);
  }
};

// 전자상거래 이벤트 (이벤트 참여 등)
export const gtag_track_conversion = (eventName: string, data: Record<string, any>): void => {
  if (!isGA4Enabled()) return;
  
  try {
    window.gtag('event', eventName, {
      currency: 'KRW',
      ...data
    });
    console.log('GA4 전환 이벤트 전송:', { eventName, data });
  } catch (error) {
    console.error('GA4 전환 이벤트 전송 오류:', error);
  }
};