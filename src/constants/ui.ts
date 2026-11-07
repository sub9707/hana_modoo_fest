/**
 * UI 관련 상수
 */

/**
 * 캠페인 통계 레이블
 */
export const CAMPAIGN_STAT_LABELS = {
  preregistration: {
    label: '사전접수 참여자',
    description: '축제 사전 등록을 완료한 시민',
  },
  comment: {
    label: '응원 댓글',
    description: '따뜻한 응원과 격려 메시지',
  },
  writing: {
    label: '가족주제 글짓기',
    description: '가족에 대한 진솔한 이야기',
  },
} as const

/**
 * Hero 섹션 텍스트
 */
export const HERO_TEXT = {
  mainTitle: ['모두의 서울', '모두 다 함께'],
  subTitle: '서울시 대표 가족축제가 찾아갑니다.',
  description: '가족다양성을 존중하고 시민이 함께 즐기는 연대의 장',
  eventInfo: {
    scheduleTitle: '행사 일정',
    locationTitle: '개최 장소',
  },
  ctaButtons: {
    registration: '사전참가 신청하기',
    campaign: '캠페인 참여하기',
  },
} as const

/**
 * 캠페인 섹션 텍스트
 */
export const CAMPAIGN_SECTION_TEXT = {
  title: '온라인 캠페인 참여하기',
  description: '집에서도, 길에서도, 언제 어디서나 함께할 수 있는 온라인 캠페인에 참여해보세요',
} as const

/**
 * API 타임아웃 설정 (ms)
 */
export const API_TIMEOUTS = {
  default: 5000,
  long: 10000,
  short: 3000,
} as const

export type CampaignStatLabels = typeof CAMPAIGN_STAT_LABELS
