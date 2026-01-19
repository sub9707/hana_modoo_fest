/**
 * 사이트 기본 정보 상수
 */
export const SITE = {
  name: '모두하나대축제',
  year: '2025',
  fullName: '모두하나대축제 2025',
  slogan: '모두의 서울, 모두 다 함께',
  description: '가족다양성을 존중하고 시민이 함께 즐기는 연대의 장',
  url: 'https://www.모두하나대축제.com',
  devUrl: 'http://localhost:3000',
  organizer: '서울특별시',
  host: '서울특별시한부모가족지원센터',
  developer: '(주)하우두유두',
  copyright: '© 2025 서울특별시한부모가족지원센터. All rights reserved.',
} as const

export type Site = typeof SITE
