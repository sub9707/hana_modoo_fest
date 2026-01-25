'use client'

import { useState } from 'react'
import TransportationCard from './TransportationCard'
import { DirectionSection, InfoBox, InfoGrid } from './shared'
import { TRANSPORTATION_DATA, TRANSPORTATION_GUIDE } from '@/constants'

export default function TransportationSection() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <DirectionSection
      title="교통편 안내"
      description="대중교통과 자가용 이용 방법을 안내드립니다"
      background="orange-pink"
    >
      {/* 교통편 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TRANSPORTATION_DATA.map((transport, index) => (
          <TransportationCard
            key={transport.type}
            data={transport}
            index={index}
            isSelected={selectedType === transport.type}
            onSelect={setSelectedType}
          />
        ))}
      </div>

      {/* 추가 안내사항 */}
      <div className="mt-16">
        <InfoBox title="교통편 이용 안내" variant="white">
          <InfoGrid>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">
                {TRANSPORTATION_GUIDE.subway.title}
              </h4>
              {TRANSPORTATION_GUIDE.subway.items.map((item, index) => (
                <p key={index} className="text-sm text-gray-600">
                  • {item}
                </p>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">
                {TRANSPORTATION_GUIDE.bus.title}
              </h4>
              {TRANSPORTATION_GUIDE.bus.items.map((item, index) => (
                <p key={index} className="text-sm text-gray-600">
                  • {item}
                </p>
              ))}
            </div>
          </InfoGrid>
        </InfoBox>
      </div>
    </DirectionSection>
  )
}
