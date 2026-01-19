/**
 * 교통편 정보 타입
 */
export interface TransportRoute {
  line: string
  station: string
  exit: string
  walkTime: string
  color: string
}

export interface TransportationData {
  type: string
  routes: TransportRoute[]
}

/**
 * 교통편 안내 데이터
 */
export const TRANSPORTATION_DATA: TransportationData[] = [
  {
    type: '지하철',
    routes: [
      {
        line: '5호선',
        station: '여의도역',
        exit: '3번 출구',
        walkTime: '도보 5분',
        color: 'purple',
      },
      {
        line: '9호선',
        station: '여의도역',
        exit: '3번 출구',
        walkTime: '도보 5분',
        color: 'amber',
      },
    ],
  },
  {
    type: '버스',
    routes: [
      {
        line: '간선버스',
        station: '162, 261, 362, 461',
        exit: '여의도공원 정류장',
        walkTime: '도보 2분',
        color: 'blue',
      },
      {
        line: '지선버스',
        station: '5623, 5633',
        exit: '여의도공원 정류장',
        walkTime: '도보 2분',
        color: 'green',
      },
    ],
  },
  {
    type: '자가용',
    routes: [
      {
        line: '강변북로',
        station: '여의도 IC 이용',
        exit: '여의도공원 방향',
        walkTime: '주차 후 도보 3분',
        color: 'gray',
      },
      {
        line: '올림픽대로',
        station: '여의도 나들목',
        exit: '여의도공원 방향',
        walkTime: '주차 후 도보 3분',
        color: 'gray',
      },
    ],
  },
]

/**
 * 주차장 정보 타입
 */
export interface ParkingInfo {
  name: string
  capacity: string
  fee: string
  distance: string
  note: string
}

/**
 * 주차장 안내 데이터
 */
export const PARKING_INFO: ParkingInfo[] = [
  {
    name: '여의도공원 주차장',
    capacity: '약 200대',
    fee: '기본 30분 1,000원',
    distance: '행사장까지 도보 3분',
    note: '행사 당일 혼잡 예상',
  },
  {
    name: '63빌딩 주차장',
    capacity: '약 1,500대',
    fee: '시간당 3,000원',
    distance: '행사장까지 도보 8분',
    note: '대형 주차장, 안정적 이용',
  },
  {
    name: '여의도 한강공원 주차장',
    capacity: '약 300대',
    fee: '기본 30분 1,200원',
    distance: '행사장까지 도보 5분',
    note: '한강 접근성 좋음',
  },
]

/**
 * 주차 안내 공지 타입
 */
export interface ParkingNoticeGroup {
  icon: string
  title: string
  items: string[]
}

/**
 * 주차 안내 공지 데이터
 */
export const PARKING_NOTICES: ParkingNoticeGroup[] = [
  {
    icon: '🚨',
    title: '주의사항',
    items: [
      '행사 당일 주차장 혼잡이 예상됩니다',
      '오전 10시 이전 도착을 권장합니다',
      '불법주차 시 과태료가 부과될 수 있습니다',
    ],
  },
  {
    icon: '💡',
    title: '추천사항',
    items: [
      '지하철 5호선, 9호선 이용 권장',
      '카풀 및 대중교통 이용 시 할인 혜택',
      '주차 대신 자전거 이용 시설 제공',
    ],
  },
]

/**
 * 교통편 이용 안내 텍스트
 */
export const TRANSPORTATION_GUIDE = {
  subway: {
    title: '지하철 이용시',
    items: [
      '5호선, 9호선 여의도역 3번 출구 이용',
      '출구에서 여의도공원 방향으로 직진',
      '문화의마당은 공원 중앙에 위치',
    ],
  },
  bus: {
    title: '버스 이용시',
    items: [
      '여의도공원 정류장 하차',
      '공원 입구에서 문화의마당까지 도보 2분',
      '행사 당일 임시 정류장 운영 예정',
    ],
  },
} as const
