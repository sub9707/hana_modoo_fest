import { ReactNode } from 'react'

interface DirectionCardProps {
  title: string
  children: ReactNode
  className?: string
  /** 언더라인 확장 너비 (기본: w-16) */
  hoverLineWidth?: string
}

export default function DirectionCard({
  title,
  children,
  className = '',
  hoverLineWidth = 'group-hover:w-16',
}: DirectionCardProps) {
  return (
    <article
      className={`
        bg-white rounded-lg border border-gray-200 p-6
        hover:shadow-lg transition-all duration-300
        hover:border-orange-300 group
        ${className}
      `}
    >
      {/* 카드 헤더 */}
      <header className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h3>
        <div
          className={`w-12 h-1 bg-gradient-to-r from-orange-300 to-pink-400 rounded ${hoverLineWidth} transition-all duration-300`}
        />
      </header>

      {/* 카드 콘텐츠 */}
      {children}
    </article>
  )
}

/** 카드 내 정보 행 컴포넌트 */
interface InfoRowProps {
  label: string
  value: string
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}

/** 카드 내 리스트 아이템 컴포넌트 */
interface ListItemProps {
  children: ReactNode
}

export function ListItem({ children }: ListItemProps) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
      <span className="leading-relaxed">{children}</span>
    </li>
  )
}
