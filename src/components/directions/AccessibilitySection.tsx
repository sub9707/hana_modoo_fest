"use client";

import ThemedButton from "../ui/ThemedButton";

const accessibilityFeatures = [
  {
    category: '접근성',
    items: [
      '휠체어 접근 가능한 무대 및 관람석',
      '장애인 전용 화장실 운영',
      '점자 안내판 및 음성 안내 서비스',
      '휠체어 대여 서비스 제공'
    ]
  },
  {
    category: '편의시설',
    items: [
      '임시 화장실 10개소 설치',
      '수유실 및 기저귀 교환대',
      '의료진 상주 응급처치소',
      '분실물 센터 운영'
    ]
  },
  {
    category: '안전시설',
    items: [
      '행사장 전체 CCTV 설치',
      '보안요원 24시간 배치',
      '비상구 및 대피로 안내',
      'AED(자동제세동기) 비치'
    ]
  }
];

const supportServices = [
  {
    title: '수화 통역 서비스',
    description: '청각장애인을 위한 전문 수화 통역사가 주요 프로그램에서 서비스를 제공합니다.',
    availability: '메인 무대 프로그램'
  },
  {
    title: '이동 지원 서비스',
    description: '거동이 불편한 분들을 위한 전동 휠체어 및 이동 보조 서비스를 제공합니다.',
    availability: '사전 신청 필요'
  },
  {
    title: '안내견 동반 입장',
    description: '시각장애인 안내견의 행사장 출입이 가능하며, 전용 휴식 공간을 제공합니다.',
    availability: '별도 신청 불요'
  },
  {
    title: '다국어 안내 서비스',
    description: '외국인 참가자를 위한 영어, 중국어, 일본어 안내 서비스를 제공합니다.',
    availability: '인포메이션 데스크'
  }
];

export default function AccessibilitySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="header-orange">접근성 & 편의시설</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              모든 참가자가 편안하고 안전하게 축제를 즐길 수 있도록 다양한 시설과 서비스를 제공합니다
            </p>
          </div>

          {/* 시설 정보 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {accessibilityFeatures.map((feature, index) => (
              <div
                key={feature.category}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.category}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-300 to-pink-400 rounded group-hover:w-20 transition-all duration-300"></div>
                </div>

                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 지원 서비스 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              특별 지원 서비스
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportServices.map((service, index) => (
                <div
                  key={service.title}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
                  style={{
                    animationDelay: `${(index + 3) * 100}ms`
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {service.title}
                    </h4>
                    <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs rounded font-medium">
                      {service.availability}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 연락처 & 신청 안내 */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold header-orange mb-2">
                접근성 지원 신청 및 문의
              </h3>
              <p className="text-gray-600">
                추가적인 지원이 필요하시거나 궁금한 사항이 있으시면 언제든지 연락해 주세요
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ThemedButton
                title="지원 서비스 신청하기"
                theme="orange"
                variant="primary"
                size="lg"
                onClick={() => { }}
              />
              <ThemedButton
                title="접근성 문의하기"
                theme="orange"
                variant="secondary"
                size="lg"
                onClick={() => { }}
              />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>전화: 02-2133-5000 | 이메일: accessibility@seoulsingleparent.or.kr</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}