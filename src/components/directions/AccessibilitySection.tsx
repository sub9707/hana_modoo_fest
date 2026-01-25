import {
  DirectionSection,
  DirectionCard,
  ListItem,
  InfoBox,
} from './shared'

const accessibilityFeatures = [
  {
    category: '접근성',
    items: [
      '휠체어 접근 가능한 무대 및 관람석',
      '장애인 전용 화장실 운영',
      '점자 안내판 및 음성 안내 서비스',
      '휠체어 대여 서비스 제공',
    ],
  },
  {
    category: '편의시설',
    items: [
      '임시 화장실 10개소 설치',
      '수유실 및 기저귀 교환대',
      '의료진 상주 응급처치소',
      '분실물 센터 운영',
    ],
  },
  {
    category: '안전시설',
    items: [
      '행사장 전체 CCTV 설치',
      '보안요원 24시간 배치',
      '비상구 및 대피로 안내',
      'AED(자동제세동기) 비치',
    ],
  },
]

const supportServices = [
  {
    title: '수화 통역 서비스',
    description:
      '청각장애인을 위한 전문 수화 통역사가 주요 프로그램에서 서비스를 제공합니다.',
    availability: '메인 무대 프로그램',
  },
  {
    title: '이동 지원 서비스',
    description:
      '거동이 불편한 분들을 위한 전동 휠체어 및 이동 보조 서비스를 제공합니다.',
    availability: '사전 신청 필요',
  },
  {
    title: '안내견 동반 입장',
    description:
      '시각장애인 안내견의 행사장 출입이 가능하며, 전용 휴식 공간을 제공합니다.',
    availability: '별도 신청 불요',
  },
  {
    title: '다국어 안내 서비스',
    description:
      '외국인 참가자를 위한 영어, 중국어, 일본어 안내 서비스를 제공합니다.',
    availability: '인포메이션 데스크',
  },
]

function ServiceCard({
  title,
  description,
  availability,
}: {
  title: string
  description: string
  availability: string
}) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h4>
        <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs rounded font-medium">
          {availability}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </article>
  )
}

export default function AccessibilitySection() {
  return (
    <DirectionSection
      title="접근성 & 편의시설"
      description="모든 참가자가 편안하고 안전하게 축제를 즐길 수 있도록 다양한 시설과 서비스를 제공합니다"
      background="orange-purple"
    >
      {/* 시설 정보 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {accessibilityFeatures.map((feature) => (
          <DirectionCard
            key={feature.category}
            title={feature.category}
            hoverLineWidth="group-hover:w-20"
          >
            <ul className="space-y-3">
              {feature.items.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DirectionCard>
        ))}
      </div>

      {/* 지원 서비스 */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          특별 지원 서비스
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportServices.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>

      {/* 연락처 & 신청 안내 */}
      <InfoBox title="접근성 지원 신청 및 문의" variant="white">
        <p className="text-gray-600 text-center mb-4">
          추가적인 지원이 필요하시거나 궁금한 사항이 있으시면 언제든지 연락해
          주세요
        </p>
        <p className="text-center text-sm sm:text-base font-bold text-gray-500">
          전화: 02-861-3020 | 이메일: hanbumo1@seoul.go.kr
        </p>
      </InfoBox>
    </DirectionSection>
  )
}
