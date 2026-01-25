import { ReactNode } from 'react'

type BackgroundVariant =
  | 'white'
  | 'orange-pink'
  | 'orange-purple'
  | 'gray'

const BACKGROUND_STYLES: Record<BackgroundVariant, string> = {
  'white': '',
  'orange-pink': 'bg-gradient-to-br from-orange-50 to-pink-50',
  'orange-purple': 'bg-gradient-to-b from-orange-50 to-purple-50',
  'gray': 'bg-gray-50',
}

interface DirectionSectionProps {
  title: string
  description?: string
  background?: BackgroundVariant
  children: ReactNode
  className?: string
}

export default function DirectionSection({
  title,
  description,
  background = 'white',
  children,
  className = '',
}: DirectionSectionProps) {
  return (
    <section className={`py-20 ${BACKGROUND_STYLES[background]} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="header-orange">{title}</span>
            </h2>
            {description && (
              <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </header>

          {/* 콘텐츠 */}
          {children}
        </div>
      </div>
    </section>
  )
}
