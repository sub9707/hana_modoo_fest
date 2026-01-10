import { ReactNode } from 'react'

interface FestivalTabHeaderProps {
  title: string | ReactNode
  description: string | ReactNode
  icon?: ReactNode
  titleColorVariant?: 'default' | 'purple-pink' | 'blue-purple' | 'green-teal' | 'orange-red'
  className?: string
  children?: ReactNode
}

const getTitleColorClass = (variant: string) => {
  switch (variant) {
    case 'purple-pink':
      return 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
    case 'blue-purple':
      return 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
    case 'green-teal':
      return 'bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'
    case 'orange-red':
      return 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'
    default:
      return 'text-gray-900'
  }
}

export default function FestivalTabHeader({
  title,
  description,
  icon,
  titleColorVariant = 'default',
  className = '',
  children
}: FestivalTabHeaderProps) {
  const titleColorClass = getTitleColorClass(titleColorVariant)

  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="inline-flex items-center justify-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <h2 className={`text-3xl md:text-4xl font-bold ${titleColorClass}`}>
          {title}
        </h2>
      </div>

      {typeof description === 'string' ? (
        <p className="text-md sm:text-lg text-gray-600">
          {description}
        </p>
      ) : (
        description
      )}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}
