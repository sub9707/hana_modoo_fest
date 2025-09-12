import { Metadata } from 'next'
import OrganizationHero from '@/components/organization/OrganizationHero'
import OrganizationIntro from '@/components/organization/OrganizationIntro'
import VisionMission from '@/components/organization/VisionMission'
import KeyPrograms from '@/components/organization/KeyPrograms'
import OrganizationStats from '@/components/organization/OrganizationStats'
import ContactInfo from '@/components/organization/ContactInfo'

export const metadata: Metadata = {
  title: '기관소개',
  description: '서울특별시한부모가족지원센터는 돌봄, 소통, 혁신의 가치로 한부모가족을 지원하는 전문기관입니다.',
  openGraph: {
    title: '기관소개 | 모두하나대축제 2025',
    description: '서울특별시한부모가족지원센터는 돌봄, 소통, 혁신의 가치로 한부모가족을 지원하는 전문기관입니다.',
    url: 'https://moduhana2025.seoul.kr/organization',
  },
}

export default async function OrganizationPage() {
  // 기관 정보 데이터 (실제로는 CMS나 API에서 가져올 수 있음)
  const organizationData = {
    intro: {
      name: "서울특별시한부모가족지원센터",
      established: "2019년",
      description: "서울특별시한부모가족지원센터는 한부모가족의 자립과 복지증진을 위해 설립된 전문기관입니다. 다양한 가족 형태를 인정하고 지원하며, 한부모가족이 당당하고 건강한 사회구성원으로 살아갈 수 있도록 종합적인 서비스를 제공합니다.",
      officialWebsite: "https://seoul-singleparent.or.kr"
    },
    vision: {
      vision: "모든 가족이 존중받는 포용적 서울",
      mission: "한부모가족의 자립지원과 사회적 편견 해소를 통한 가족다양성 실현",
      values: [
        {
          title: "돌봄",
          description: "따뜻한 관심과 세심한 배려로 한부모가족을 지원합니다",
          icon: "heart"
        },
        {
          title: "소통",
          description: "열린 마음으로 소통하며 함께 성장하는 공동체를 만듭니다",
          icon: "messageCircle"
        },
        {
          title: "혁신",
          description: "새로운 시각과 창의적 접근으로 더 나은 서비스를 제공합니다",
          icon: "lightbulb"
        }
      ]
    },
    programs: [
      {
        category: "자립지원",
        title: "경제적 자립 프로그램",
        description: "취업지원, 직업훈련, 창업지원 등을 통한 경제적 자립 도모",
        services: ["취업상담 및 연계", "직업능력개발훈련", "창업지원 프로그램", "생활안정자금 지원"]
      },
      {
        category: "심리정서",
        title: "심리정서 지원 프로그램",
        description: "개인 및 가족 상담을 통한 심리적 안정과 성장 지원",
        services: ["개인상담", "가족상담", "집단상담 프로그램", "심리검사"]
      },
      {
        category: "교육문화",
        title: "교육문화 프로그램",
        description: "다양한 교육과 문화활동을 통한 역량강화 및 여가지원",
        services: ["부모교육", "자녀교육지원", "문화체험 프로그램", "자조모임 운영"]
      },
      {
        category: "사회참여",
        title: "사회참여 활성화",
        description: "한부모가족의 사회참여 확대와 네트워크 구축 지원",
        services: ["자원봉사 연계", "사회참여 프로그램", "네트워킹 이벤트", "옹호활동"]
      }
    ],
    stats: {
      year: 2024,
      data: [
        { label: "지원가족 수", value: "2,500", unit: "가족" },
        { label: "운영 프로그램", value: "50", unit: "개" },
        { label: "자조모임", value: "25", unit: "개" },
        { label: "협력기관", value: "100", unit: "개" }
      ]
    },
    contact: {
      address: "서울특별시 중구 세종대로 110 서울특별시청",
      phone: "02-123-4567",
      fax: "02-123-4568",
      email: "info@seoul-singleparent.or.kr",
      website: "https://seoul-singleparent.or.kr",
      hours: "평일 09:00-18:00 (토·일·공휴일 휴무)",
      subway: "시청역 2번 출구 도보 3분"
    }
  }

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <OrganizationHero />

      {/* 기관 소개 */}
      {/* <OrganizationIntro intro={organizationData.intro} /> */}

      {/* 비전과 미션 */}
      {/* <VisionMission vision={organizationData.vision} /> */}

      {/* 주요 사업 */}
      {/* <KeyPrograms programs={organizationData.programs} /> */}

      {/* 운영 현황 */}
      {/* <OrganizationStats stats={organizationData.stats} /> */}

      {/* 연락처 정보 */}
      {/* <ContactInfo contact={organizationData.contact} /> */}
    </div>
  )
}