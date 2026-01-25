import {
  DirectionSection,
  DirectionCard,
  InfoRow,
  InfoBox,
  InfoGroup,
  InfoGrid,
} from './shared'
import {
  PARKING_INFO,
  PARKING_NOTICES,
  type ParkingInfo,
} from '@/constants'

function ParkingCard({ parking }: { parking: ParkingInfo }) {
  return (
    <DirectionCard title={parking.name}>
      <div className="space-y-3 text-sm">
        <InfoRow label="수용대수" value={parking.capacity} />
        <InfoRow label="주차요금" value={parking.fee} />
        <InfoRow label="거리" value={parking.distance} />
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-500 text-xs leading-relaxed">
            {parking.note}
          </p>
        </div>
      </div>
    </DirectionCard>
  )
}

export default function ParkingSection() {
  return (
    <DirectionSection
      title="주차 안내"
      description="행사 당일 주차 공간이 제한적이니 대중교통 이용을 권장합니다"
      background="white"
    >
      {/* 주차장 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {PARKING_INFO.map((parking) => (
          <ParkingCard key={parking.name} parking={parking} />
        ))}
      </div>

      {/* 주차 이용 안내 */}
      <InfoBox title="주차 이용 안내" variant="gradient">
        <InfoGrid>
          {PARKING_NOTICES.map((group) => (
            <InfoGroup
              key={group.title}
              title={group.title}
              icon={group.icon}
              items={group.items}
            />
          ))}
        </InfoGrid>
      </InfoBox>
    </DirectionSection>
  )
}
