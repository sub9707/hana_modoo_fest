import { SITE } from './site'

/**
 * SEO 기본 설정
 */
export const DEFAULT_SEO = {
  title: `${SITE.fullName} | 서울시 대표 가족축제`,
  description: `서울특별시가 주최하는 ${SITE.fullName}. ${SITE.description}.`,
  keywords: ['모두하나대축제', '2025', '한부모가족', '축제', '서울시', '가족다양성', '가족축제'],
  ogImage: '/images/modoo_hana_image.png',
  ogImageAlt: `${SITE.fullName} 로고`,
  ogImageWidth: 332,
  ogImageHeight: 265,
  favicon: '/favicon.ico',
  locale: 'ko_KR',
  type: 'website',
} as const

/**
 * 페이지별 메타데이터 생성
 */
export const createPageMetadata = (
  title: string,
  description?: string,
  options?: {
    ogTitle?: string
    ogDescription?: string
    keywords?: string[]
  }
) => ({
  title,
  description: description || DEFAULT_SEO.description,
  keywords: options?.keywords || [...DEFAULT_SEO.keywords],
  openGraph: {
    title: options?.ogTitle || `${title} | ${SITE.fullName}`,
    description: options?.ogDescription || description || DEFAULT_SEO.description,
    type: DEFAULT_SEO.type as 'website',
    locale: DEFAULT_SEO.locale,
    images: [
      {
        url: DEFAULT_SEO.ogImage,
        width: DEFAULT_SEO.ogImageWidth,
        height: DEFAULT_SEO.ogImageHeight,
        alt: DEFAULT_SEO.ogImageAlt,
      },
    ],
  },
  icons: {
    icon: DEFAULT_SEO.favicon,
  },
})

/**
 * 페이지별 SEO 설정
 */
export const PAGE_SEO = {
  home: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
  },
  about: {
    title: '축제 소개',
    description: `서울시 대표 가족축제 ${SITE.fullName}. ${SITE.description}. 2025년 10월 18일 여의도공원에서 만나요.`,
  },
  news: {
    title: `공지/소식 | ${SITE.fullName}`,
    description: `${SITE.fullName}의 최신 소식과 공지사항을 확인하세요.`,
    keywords: ['모두하나대축제', '2025', '공지사항', '이벤트', '한부모가족', '축제'],
  },
  directions: {
    title: '오시는 길',
    description: `${SITE.fullName}가 열리는 여의도공원 문화의마당으로 오시는 길을 안내합니다.`,
  },
  organization: {
    title: '기관 소개',
    description: '서울특별시한부모가족지원센터를 소개합니다.',
  },
  partners: {
    title: '함께하는 기관',
    description: `${SITE.fullName}와 함께하는 협력기관을 소개합니다.`,
  },
  programs: {
    title: '행사 프로그램',
    description: `${SITE.fullName}의 다양한 프로그램을 확인하세요.`,
  },
  onlineFestival: {
    title: '온라인 축제',
    description: `${SITE.fullName} 온라인 캠페인에 참여하세요.`,
  },
  registration: {
    title: '사전참가 신청',
    description: `${SITE.fullName} 사전참가 신청 페이지입니다.`,
  },
  gallery: {
    title: '갤러리',
    description: `${SITE.fullName}의 추억을 사진으로 만나보세요.`,
  },
  login: {
    title: '로그인',
    description: `${SITE.fullName} 로그인`,
  },
  privacyPolicy: {
    title: '개인정보 처리방침',
    description: `${SITE.fullName}의 개인정보 처리방침입니다.`,
  },
  termsOfService: {
    title: '서비스 이용약관',
    description: `${SITE.fullName} 서비스 이용약관`,
  },
} as const

export type DefaultSeo = typeof DEFAULT_SEO
export type PageSeo = typeof PAGE_SEO
