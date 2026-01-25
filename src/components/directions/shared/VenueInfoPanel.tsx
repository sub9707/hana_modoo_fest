interface VenueInfoPanelProps {
  address: string
  operatingHours: string
  admission: string
  variant?: 'desktop' | 'mobile'
  className?: string
}

interface InfoItemProps {
  label: string
  value: string
  className?: string
}

function InfoItem({ label, value, className = '' }: InfoItemProps) {
  return (
    <div className={className}>
      <h4 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm uppercase tracking-wider">
        {label}
      </h4>
      <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
    </div>
  )
}

export default function VenueInfoPanel({
  address,
  operatingHours,
  admission,
  variant = 'desktop',
  className = '',
}: VenueInfoPanelProps) {
  const isDesktop = variant === 'desktop'

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        isDesktop ? 'p-6 flex-1' : 'p-4'
      } ${className}`}
    >
      <h3
        className={`font-bold text-orange-600 ${
          isDesktop ? 'text-lg mb-4' : 'text-base sm:text-lg mb-3 sm:mb-4'
        }`}
      >
        행사장 정보
      </h3>

      {isDesktop ? (
        <div className="space-y-4">
          <InfoItem label="주소" value={address} />
          <InfoItem label="운영시간" value={operatingHours} />
          <InfoItem label="입장료" value={admission} />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <InfoItem label="주소" value={address} />
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="운영시간" value={operatingHours} />
            <InfoItem label="입장료" value={admission} />
          </div>
        </div>
      )}
    </div>
  )
}
