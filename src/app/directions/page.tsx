import { Metadata } from 'next'
import DirectionsHero from '@/components/directions/DirectionHero'
import EventLocationMap from '@/components/directions/EventLocationMap'
import TransportInfo from '@/components/directions/TransportInfo'
import AccessibilityInfo from '@/components/directions/AccessibilityInfo'
import ParkingInfo from '@/components/directions/ParkingInfo'
import WeatherNotice from '@/components/directions/WeatherNotice'

export const metadata: Metadata = {
  title: '오시는 길',
  description: '모두하나대축제 2025 행사장인 여의도공원 문화의마당 오시는 길을 안내합니다. 지하철, 버스, 자가용 이용 방법을 확인하세요.',
  openGraph: {
    title: '오시는 길 | 모두하나대축제 2025',
    description: '여의도공원 문화의마당으로 오시는 교통편과 접근성 정보를 확인하세요.',
  },
}

export default function DirectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 날씨/안전 공지 배너 */}
      <WeatherNotice />
      
      {/* 히어로 섹션 */}
      <DirectionsHero />
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 행사장 지도 */}
        <section className="mb-16">
          <EventLocationMap />
        </section>
        
        {/* 교통 정보 */}
        <section className="mb-16">
          <TransportInfo />
        </section>
        
        {/* 주차 정보 */}
        <section className="mb-16">
          <ParkingInfo />
        </section>
        
        {/* 접근성 정보 */}
        <section className="mb-16">
          <AccessibilityInfo />
        </section>
      </div>
    </div>
  )
}