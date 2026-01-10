import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  title: string
  icon?: LucideIcon
  iconColor?: string
  children: ReactNode
  variant?: 'default' | 'gradient' | 'glow'
  className?: string
}

export default function InfoCard({
  title,
  icon: Icon,
  iconColor = 'text-gray-600',
  children,
  variant = 'default',
  className = ''
}: InfoCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-white/90 via-white/80 to-white/70'
      case 'glow':
        return 'bg-white/80  shadow-lg shadow-orange-500/10'
      default:
        return 'bg-white/70 '
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`rounded-2xl p-6 backdrop-blur-sm ${getVariantClasses()}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          {Icon && <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />}
          {title}
        </h3>
        {children}
      </div>
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-purple-500/5 rounded-2xl blur-xl -z-10"></div>
      )}
    </div>
  )
}
