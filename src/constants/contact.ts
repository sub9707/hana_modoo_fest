/**
 * 연락처 및 소셜 미디어 상수
 */
export const CONTACT = {
  // 전화 및 이메일
  phone: '02-861-3020',
  email: 'hanbumo1@seoul.go.kr',

  // 소셜 미디어
  social: {
    instagram: {
      url: 'https://www.instagram.com/seoulhanbumo_official/',
      label: '인스타그램',
    },
    youtube: {
      url: 'https://youtube.com/@서울특별시한부모가족',
      label: '유튜브',
    },
    website: {
      url: 'https://www.seoulhanbumo.or.kr/han/main/index.do',
      label: '홈페이지',
    },
  },
} as const

export type Contact = typeof CONTACT
