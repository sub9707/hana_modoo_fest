import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import FestivalOverview from '@/components/home/FestivalOverview'
import OnlineCampaign from '@/components/home/OnlineCampaign'
import LatestNews from '@/components/home/LatestNews'
import LocationPreview from '@/components/home/LocationPreview'
import PartnersSlider from '@/components/home/PartnersSlider'

export const metadata: Metadata = {
  title: '모두하나대축제 2025 | 서울시 대표 가족축제',
  description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장. 2025년 10월 18일 여의도공원에서 만나요.',
  openGraph: {
    title: '모두하나대축제 2025 | 서울시 대표 가족축제',
    description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
    url: 'https://moduhana2025.seoul.kr',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '모두하나대축제 2025 포스터',
      },
    ],
  },
}

// Mock 데이터 가져오기 (실제로는 API에서 가져올 것)
async function getHomeData() {
  // 서버 컴포넌트에서 데이터 페칭 시뮬레이션
  return {
    campaignStats: {
      totalParticipants: 1247,
      hashtagPosts: 892,
      photoPosts: 355,
      quizParticipants: 623
    },
    latestNews: [
      {
        id: '1',
        title: '모두하나대축제 2025 자원봉사자 모집',
        excerpt: '축제 당일 함께할 자원봉사자를 모집합니다. 다양한 활동 영역에서 시민들과 함께해요.',
        category: 'recruitment',
        publishedAt: '2025-09-05',
        isPinned: true
      },
      {
        id: '2', 
        title: '온라인 해시태그 챌린지 이벤트 시작!',
        excerpt: '#모두의서울 #함께하는축제 해시태그와 함께 일상 속 가족 이야기를 공유해주세요.',
        category: 'event',
        publishedAt: '2025-09-03',
        isPinned: false
      },
      {
        id: '3',
        title: '축제 프로그램 타임테이블 공개',
        excerpt: '무대 공연부터 체험 부스까지, 하루 종일 즐길 수 있는 다채로운 프로그램을 확인하세요.',
        category: 'venue-info',
        publishedAt: '2025-09-01',
        isPinned: false
      }
    ],
    partners: [
      {
        id: '1',
        name: '서울특별시',
        type: 'host',
        logoUrl: '/images/partners/seoul-city.svg',
        category: '주최'
      },
      {
        id: '2',
        name: '서울특별시한부모가족지원센터',
        type: 'organizer', 
        logoUrl: '/images/partners/single-parent-center.svg',
        category: '주관'
      },
      {
        id: '3',
        name: '여성가족부',
        type: 'sponsor',
        logoUrl: '/images/partners/mogef.svg', 
        category: '후원'
      },
      {
        id: '4',
        name: '한국건강가정진흥원',
        type: 'cooperation',
        logoUrl: '/images/partners/kihf.svg',
        category: '협력'
      }
    ]
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 축제 한눈에 보기 */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50 to-white">
        <FestivalOverview />
      </section>

      {/* 온라인 캠페인 스냅샷 */}
      <section className="py-16 lg:py-24 bg-white">
        <OnlineCampaign stats={data.campaignStats} />
      </section>

      {/* 최신 공지/소식 */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <LatestNews news={data.latestNews} />
      </section>

      {/* 함께하는 기관 */}
      <section className="py-12 lg:py-16 bg-white border-t border-slate-200">
        <PartnersSlider partners={data.partners} />
      </section>

      {/* 오시는 길 미리보기 */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <LocationPreview />
      </section>
    </div>
  )
}