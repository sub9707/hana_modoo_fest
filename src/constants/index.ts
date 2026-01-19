/**
 * Constants
 */

// 사이트 기본 정보
export { SITE } from './site'
export type { Site } from './site'

// 축제 정보
export { FESTIVAL } from './festival'
export type { Festival } from './festival'

// 라우트 경로
export { ROUTES } from './routes'
export type { Routes } from './routes'

// 연락처 정보
export { CONTACT } from './contact'
export type { Contact } from './contact'

// 네비게이션
export {
  MAIN_NAVIGATION,
  QUICK_BAR_ITEMS,
  FOOTER_QUICK_LINKS,
  FOOTER_LEGAL_LINKS,
} from './navigation'
export type { MainNavigation, QuickBarItems } from './navigation'

// 교통/주차 정보
export {
  TRANSPORTATION_DATA,
  PARKING_INFO,
  PARKING_NOTICES,
  TRANSPORTATION_GUIDE,
} from './directions'
export type {
  TransportRoute,
  TransportationData,
  ParkingInfo,
  ParkingNoticeGroup,
} from './directions'

// SEO
export { DEFAULT_SEO, PAGE_SEO, createPageMetadata } from './seo'
export type { DefaultSeo, PageSeo } from './seo'

// UI 상수
export {
  FALLBACK_STATS,
  CAMPAIGN_STAT_LABELS,
  HERO_TEXT,
  CAMPAIGN_SECTION_TEXT,
  API_TIMEOUTS,
} from './ui'
export type { FallbackStats, CampaignStatLabels } from './ui'
