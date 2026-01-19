/**
 * 축제 정보 상수
 */
export const FESTIVAL = {
  // 날짜 정보
  date: '2025년 10월 18일 (토)',
  dateShort: '2025.10.18(토)',
  dateFormatted: '2025. 10. 18 (토)',

  // ISO 날짜 형식 (구조화 데이터용)
  isoStartDate: '2025-10-18T11:00:00+09:00',
  isoEndDate: '2025-10-18T17:00:00+09:00',

  // 시간 정보
  time: '11:00 - 17:00',
  timeDisplay: '오전 11:00 - 오후 5:00',
  operatingHours: '2025. 10. 18 (토) 11:00 - 17:00',
  timeRange: {
    start: '11:00',
    end: '17:00',
  },

  // 장소 정보
  location: {
    name: '여의도공원 문화의마당',
    shortName: '여의도공원',
    subName: '문화의마당',
    address: '서울특별시 영등포구 여의도공원',
    fullAddress: '서울특별시 영등포구 여의도동 여의도공원',
    coordinates: {
      lat: 37.5246435,
      lng: 126.9203898,
    },
  },

  // 기타 정보
  admission: '무료 (사전신청 권장)',
  onlineCampaignPeriod: '2025년 9월 ~ 10월',
} as const

export type Festival = typeof FESTIVAL
