import { Metadata } from 'next'
import FestivalHero from '@/components/about/FestivalHero'
import FestivalPurpose from '@/components/about/FestivalPurpose'
import CoreValues from '@/components/about/CoreValues'
import FestivalOverview from '@/components/about/FestivalOverview'
import FestivalHistory from '@/components/about/FestivalHistory'
import CallToAction from '@/components/common/CallToAction'

export const metadata: Metadata = {
  title: '축제소개',
  description: '모두하나대축제는 가족다양성 인식 확산과 시민 연대 문화 조성을 위한 서울시 대표 가족축제입니다.',
  openGraph: {
    title: '축제소개 | 모두하나대축제 2025',
    description: '모두하나대축제는 가족다양성 인식 확산과 시민 연대 문화 조성을 위한 서울시 대표 가족축제입니다.',
    url: 'https://moduhana2025.seoul.kr/about',
  },
}

export default async function AboutPage() {
  // 축제 정보 데이터 (실제로는 CMS나 API에서 가져올 수 있음)
  const festivalData = {
    purpose: {
      main: "가족다양성 인식 확산과 시민 연대 문화 조성",
      description: "서울특별시가 주최하고 서울특별시한부모가족지원센터가 주관하는 '모두하나대축제'는 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장입니다."
    },
    coreValues: [
      {
        title: "한부모 인식개선",
        description: "편견 없는 사회를 만들기 위한 인식 개선",
        icon: "heart"
      },
      {
        title: "가족다양성 확산",
        description: "다양한 가족 형태에 대한 이해와 존중",
        icon: "users"
      },
      {
        title: "시민 연대",
        description: "모두가 함께하는 포용적 지역사회 구축",
        icon: "handshake"
      }
    ],
    overview: {
      date: "2025년 10월 18일 (토)",
      time: "11:00 - 16:00",
      location: "여의도공원 문화의마당",
      host: "서울특별시",
      organizer: "서울특별시한부모가족지원센터",
      programs: [
        "가족다양성 인식개선 프로그램",
        "시민참여 문화공연",
        "자조모임 부스 운영",
        "지역사회 연대 활동"
      ],
      onlinePeriod: "2025년 9월 - 10월"
    },
    history: {
      years: [
        {
          year: 2023,
          theme: "가족, 다양성의 시작",
          participants: "5,000여 명",
          highlights: ["첫 개최", "시민 호응"]
        },
        {
          year: 2024,
          theme: "모두가 함께하는 서울",
          participants: "8,000여 명", 
          highlights: ["온라인 연계", "프로그램 확대"]
        },
        {
          year: 2025,
          theme: "모두의 서울, 모두 다 함께",
          participants: "10,000여 명 목표",
          highlights: ["디지털 캠페인 강화", "접근성 개선"]
        }
      ]
    }
  }

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <FestivalHero />

      {/* 축제 목적 및 의의 */}
      <FestivalPurpose purpose={festivalData.purpose} />

      {/* 핵심 가치 */}
      <CoreValues values={festivalData.coreValues} />

      {/* 행사 개요 */}
      <FestivalOverview overview={festivalData.overview} />

      {/* 축제 연혁 */}
      <FestivalHistory history={festivalData.history} />

      {/* 참여 유도 섹션 */}
      <CallToAction 
        title="모두하나대축제와 함께하세요"
        description="가족다양성을 존중하고 시민이 함께 만드는 축제에 참여해보세요."
        primaryButton={{
          text: "사전참가 신청하기",
          href: "/registration"
        }}
        secondaryButton={{
          text: "온라인 캠페인 참여",
          href: "/campaign"
        }}
      />
    </div>
  )
}