import { Home, Calendar, UserPlus, Play, MapPin } from 'lucide-react'
import { ROUTES } from './routes'

/**
 * 메인 네비게이션 항목 (Header)
 */
export const MAIN_NAVIGATION = [
  { name: '축제 소개', href: ROUTES.about },
  { name: '기관 소개', href: ROUTES.organization },
  { name: '온라인 축제', href: ROUTES.onlineFestival },
  { name: '행사 프로그램', href: ROUTES.programs },
  { name: '공지/소식', href: ROUTES.news },
  { name: '오시는 길', href: ROUTES.directions },
  { name: '함께하는 기관', href: ROUTES.partners },
] as const

/**
 * 모바일 하단 퀵바 항목
 */
export const QUICK_BAR_ITEMS = [
  { icon: Home, label: '홈', href: ROUTES.home },
  { icon: Calendar, label: '프로그램', href: ROUTES.programs },
  { icon: UserPlus, label: '신청', href: ROUTES.registration, isHighlight: true },
  { icon: Play, label: '참여하기', href: ROUTES.onlineFestival },
  { icon: MapPin, label: '오시는 길', href: ROUTES.directions },
] as const

/**
 * Footer 바로가기 링크
 */
export const FOOTER_QUICK_LINKS = [
  { name: '사전참가신청', href: ROUTES.register },
  { name: '행사프로그램', href: ROUTES.programs },
  { name: '온라인축제', href: ROUTES.onlineFestival },
  { name: '오시는길', href: ROUTES.directions },
] as const

/**
 * Footer 법적 링크
 */
export const FOOTER_LEGAL_LINKS = [
  { name: '개인정보처리방침', href: ROUTES.privacyPolicy },
  { name: '이용약관', href: ROUTES.termsOfService },
] as const

export type MainNavigation = typeof MAIN_NAVIGATION
export type QuickBarItems = typeof QUICK_BAR_ITEMS
