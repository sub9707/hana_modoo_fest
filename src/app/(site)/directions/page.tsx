import { Metadata } from 'next'
import DirectionsHero from '@/components/directions/DirectionHero'
import WeatherNotice from '@/components/directions/WeatherNotice'
import ParkingSection from '@/components/directions/ParkingSection';
import TransportationSection from '@/components/directions/TransportationSection';
import DirectionsMap from '@/components/directions/DirectionsMap';
import AccessibilitySection from '@/components/directions/AccessibilitySection';

export const metadata: Metadata = {
  title: '오시는 길',
  description: '모두하나대축제 2025가 열리는 여의도공원 문화의마당으로 오시는 길을 안내합니다.',
  openGraph: {
    title: '오시는 길 | 모두하나대축제 2025',
    description: '여의도공원 문화의마당에서 10월 18일 만나요. 대중교통 및 주차 안내 정보를 확인하세요.',
    images: [
      {
        url: '/images/directions/directions-og.jpg',
        width: 1200,
        height: 630,
        alt: '모두하나대축제 2025 오시는 길',
      },
    ],
  },
};

// 행사장 정보 데이터
const venueData = {
  name: '여의도공원 문화의마당',
  address: '서울특별시 영등포구 여의도동 여의도공원',
  detailAddress: '서울특별시 영등포구 여의도공원',
  date: '2025년 10월 18일 (토)',
  time: '오전 11:00 - 오후 5:00',
  operatingHours: '2025. 10. 18 (토) 11:00 - 17:00',
  admission: '무료 (사전신청 권장)',
  coordinates: {
    lat: 37.5246435,
    lng: 126.9203898
  }
};

export default function DirectionsPage() {
  return (
    <div className="min-h-screen bg-white font-paper">
      {/* 날씨/안전 공지 배너 */}
      <WeatherNotice />

      {/* 히어로 섹션 */}
      <DirectionsHero venueData={venueData} />

      {/* 지도 섹션 */}
      <DirectionsMap venueData={venueData} />

      {/* 교통편 안내 */}
      <TransportationSection />

      {/* 주차 안내 */}
      <ParkingSection />

      {/* 접근성 & 편의시설 */}
      {/* <AccessibilitySection /> */}
    </div >
  )
}