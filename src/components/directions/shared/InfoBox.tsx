import { ReactNode } from 'react'

type InfoBoxVariant = 'white' | 'gradient'

const VARIANT_STYLES: Record<InfoBoxVariant, string> = {
  white: 'bg-white border-gray-200',
  gradient: 'bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200',
}

interface InfoBoxProps {
  title: string
  variant?: InfoBoxVariant
  children: ReactNode
  className?: string
}

export default function InfoBox({
  title,
  variant = 'white',
  children,
  className = '',
}: InfoBoxProps) {
  return (
    <div
      className={`rounded-lg border p-8 ${VARIANT_STYLES[variant]} ${className}`}
    >
      <h3 className="text-xl font-bold header-orange text-center mb-6">
        {title}
      </h3>
      {children}
    </div>
  )
}

/** InfoBox 내 그룹 섹션 */
interface InfoGroupProps {
  title: string
  icon?: string
  items: string[]
}

export function InfoGroup({ title, icon, items }: InfoGroupProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h4>
      <ul className="text-sm text-gray-600 space-y-1 pl-4">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

/** InfoBox 내 2열 그리드 레이아웃 */
interface InfoGridProps {
  children: ReactNode
}

export function InfoGrid({ children }: InfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  )
}
