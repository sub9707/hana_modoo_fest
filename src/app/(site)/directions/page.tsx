import { Metadata } from 'next'
import DirectionsHero from '@/components/directions/DirectionHero'
import WeatherNotice from '@/components/directions/WeatherNotice'
import ParkingSection from '@/components/directions/ParkingSection';
import TransportationSection from '@/components/directions/TransportationSection';
import DirectionsMap from '@/components/directions/DirectionsMap';
import PageLayout from '@/components/layout/PageLayout'
import { FESTIVAL, PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.directions.title,
  PAGE_SEO.directions.description,
  {
    ogTitle: `${PAGE_SEO.directions.title} | 모두하나대축제 2025`,
    ogDescription: `여의도공원 문화의마당에서 ${FESTIVAL.date} 만나요. 대중교통 및 주차 안내 정보를 확인하세요.`,
  }
);

// 행사장 정보
const venueData = {
  name: FESTIVAL.location.name,
  address: FESTIVAL.location.fullAddress,
  detailAddress: FESTIVAL.location.address,
  date: FESTIVAL.date,
  time: FESTIVAL.timeDisplay,
  operatingHours: FESTIVAL.operatingHours,
  admission: FESTIVAL.admission,
  coordinates: FESTIVAL.location.coordinates
};

export default function DirectionsPage() {
  return (
    <PageLayout variant="white">
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
    </PageLayout>
  )
}
