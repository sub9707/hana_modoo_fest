import { Metadata } from 'next'
import OrganizationHero from '@/components/organization/OrganizationHero'
import VisionSection from '@/components/organization/VisionSection'
import BusinessSection from '@/components/organization/BusinessSection'
import ContactSection from '@/components/organization/ContactSection'

export const metadata: Metadata = {
  title: '기관 소개',
  description: '서울특별시한부모가족지원센터를 소개합니다. 돌봄, 소통, 혁신의 가치로 한부모가족의 자립과 복지 증진을 위해 노력합니다.',
  openGraph: {
    title: '기관 소개 | 모두하나대축제 2025',
    description: '서울특별시한부모가족지원센터를 소개합니다. 돌봄, 소통, 혁신의 가치로 한부모가족의 자립과 복지 증진을 위해 노력합니다.',
    images: [
      {
        url: '/images/organization/organization-og.jpg',
        width: 1200,
        height: 630,
        alt: '서울특별시한부모가족지원센터 소개',
      },
    ],
  },
}

// 기관 정보 데이터
const organizationData = {
  name: '서울특별시한부모가족지원센터',
  englishName: 'Seoul Single Parent Family Support Center',
  established: '2019년',
  vision: '모든 가족이 행복한 포용사회 실현',
  mission: '한부모가족의 자립과 사회통합을 통한 삶의 질 향상',
  coreValues: [
    {
      title: '돌봄',
      subtitle: 'Care',
      description: '한부모가족의 어려움을 이해하고 따뜻한 돌봄을 제공합니다',
      icon: '🤝',
      color: 'blue'
    },
    {
      title: '소통',
      subtitle: 'Communication', 
      description: '가족 간, 지역사회와의 원활한 소통을 지원합니다',
      icon: '💬',
      color: 'green'
    },
    {
      title: '혁신',
      subtitle: 'Innovation',
      description: '변화하는 사회에 맞는 새로운 서비스를 개발합니다',
      icon: '💡',
      color: 'purple'
    }
  ],
  mainServices: [
    {
      category: '상담 및 정보제공',
      services: ['생활상담', '법률상담', '심리상담', '자녀양육상담', '정보제공 서비스'],
      icon: '📞'
    },
    {
      category: '교육 및 문화',
      services: ['자립역량강화교육', '자녀교육프로그램', '문화체험활동', '가족캠프'],
      icon: '📚'
    },
    {
      category: '경제적 지원',
      services: ['긴급지원사업', '후원사업', '장학금지원', '생활용품지원'],
      icon: '💰'
    },
    {
      category: '네트워킹',
      services: ['자조모임운영', '멘토링사업', '지역사회연계', '취업연계서비스'],
      icon: '🌐'
    }
  ],
  achievements: [
    { year: '2019', content: '서울특별시한부모가족지원센터 설립' },
    { year: '2020', content: '코로나19 대응 비대면 상담서비스 개시' },
    { year: '2021', content: '한부모가족 자립지원 우수기관 선정' },
    { year: '2022', content: '가족다양성 인식개선 캠페인 시작' },
    { year: '2023', content: '모두하나대축제 첫 개최' },
    { year: '2024', content: '한부모가족 1만 가구 서비스 달성' },
    { year: '2025', content: '모두하나대축제 2025 개최 예정' }
  ],
  contact: {
    address: '서울특별시 중구 세종대로 110 서울특별시청',
    phone: '02-2133-5000',
    fax: '02-2133-0000', 
    email: 'contact@seoulsingleparent.or.kr',
    website: 'https://www.seoulsingleparent.or.kr',
    hours: '평일 09:00 ~ 18:00 (토·일·공휴일 휴무)'
  }
}

export default async function OrganizationPage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <OrganizationHero organizationData={organizationData} />
      
      {/* 비전과 가치 섹션 */}
      <VisionSection coreValues={organizationData.coreValues} vision={organizationData.vision} mission={organizationData.mission} />
      
      {/* 주요 사업 섹션 */}
      <BusinessSection mainServices={organizationData.mainServices} achievements={organizationData.achievements} />
      
      {/* 연락처 섹션 */}
      <ContactSection contact={organizationData.contact} />
    </div>
  )
}