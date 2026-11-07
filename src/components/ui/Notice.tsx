import { ReactNode } from 'react'

interface NoticeProps {
  title: string
  children: ReactNode
  className?: string
}

/**
 * 사이트 공통 안내 박스.
 * 아이콘·왼쪽 굵은 보더·그라데이션 없이 얇은 테두리와 타이포만으로 구분한다.
 */
export default function Notice({ title, children, className = '' }: NoticeProps) {
  return (
    <section className={`rounded-lg border border-gray-200 bg-white px-6 py-5 ${className}`}>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <div className="text-sm leading-relaxed text-gray-600 space-y-1">{children}</div>
    </section>
  )
}
