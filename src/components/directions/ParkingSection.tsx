import {
  PARKING_INFO,
  PARKING_NOTICES,
  type ParkingInfo,
  type ParkingNoticeGroup,
} from '@/constants'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ParkingCard({ parking }: { parking: ParkingInfo }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
          {parking.name}
        </h3>
        <div className="w-12 h-1 bg-gradient-to-r from-orange-300 to-pink-400 rounded group-hover:w-16 transition-all duration-300" />
      </div>

      <div className="space-y-3 text-sm">
        <InfoRow label="수용대수" value={parking.capacity} />
        <InfoRow label="주차요금" value={parking.fee} />
        <InfoRow label="거리" value={parking.distance} />
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-500 text-xs leading-relaxed">{parking.note}</p>
        </div>
      </div>
    </div>
  );
}

function NoticeSection({ group }: { group: ParkingNoticeGroup }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
        {group.icon} {group.title}
      </h4>
      <ul className="text-sm text-gray-600 space-y-1 pl-4">
        {group.items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ParkingSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="header-orange">주차 안내</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
              행사 당일 주차 공간이 제한적이니 대중교통 이용을 권장합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {PARKING_INFO.map((parking) => (
              <ParkingCard key={parking.name} parking={parking} />
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 p-8">
            <h3 className="text-xl font-bold header-orange text-center mb-6">
              주차 이용 안내
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PARKING_NOTICES.map((group) => (
                <NoticeSection key={group.title} group={group} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
