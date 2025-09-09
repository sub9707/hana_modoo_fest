import Link from 'next/link'
import { Clock, MapPin, Users, Star, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Program {
  id: string
  title: string
  description: string
  category: 'official' | 'performance' | 'experience' | 'support-group' | 'solidarity'
  startTime: string
  endTime: string
  location: string
  zone: string
  targetAudience: string[]
  capacity?: number
  remainingSlots?: number
  isBookingRequired: boolean
  tags: string[]
  organizer: string
  accessibility: {
    wheelchairAccessible: boolean
    signLanguage: boolean
    audioDescription: boolean
  }
}

interface ProgramCardProps {
  program: Program
  onFavorite?: (programId: string) => void
  isFavorited?: boolean
}

const categoryLabels = {
  official: '공식행사',
  performance: '무대공연',
  experience: '체험부스',
  'support-group': '자조모임',
  solidarity: '연대부스'
}

const categoryColors = {
  official: 'bg-blue-100 text-blue-700',
  performance: 'bg-purple-100 text-purple-700',
  experience: 'bg-green-100 text-green-700',
  'support-group': 'bg-orange-100 text-orange-700',
  solidarity: 'bg-pink-100 text-pink-700'
}

export default function ProgramCard({ program, onFavorite, isFavorited = false }: ProgramCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(program.id)
  }

  const getAvailabilityStatus = () => {
    if (!program.capacity) return null
    
    const percentage = ((program.remainingSlots || 0) / program.capacity) * 100
    
    if (percentage > 50) return { status: '여유', color: 'text-green-600' }
    if (percentage > 20) return { status: '보통', color: 'text-yellow-600' }
    if (percentage > 0) return { status: '마감임박', color: 'text-red-600' }
    return { status: '마감', color: 'text-red-600' }
  }

  const availabilityStatus = getAvailabilityStatus()

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 festival-card-hover">
      <CardContent className="p-0">
        {/* 카드 헤더 */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start justify-between mb-3">
            <Badge className={categoryColors[program.category]}>
              {categoryLabels[program.category]}
            </Badge>
            
            <div className="flex items-center space-x-2">
              {availabilityStatus && (
                <span className={`text-xs font-medium ${availabilityStatus.color}`}>
                  {availabilityStatus.status}
                </span>
              )}
              
              <button
                onClick={handleFavorite}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label={isFavorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                />
              </button>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/programs/${program.id}`}>
              {program.title}
            </Link>
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* 프로그램 정보 */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{program.startTime} - {program.endTime}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{program.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{program.targetAudience.join(', ')}</span>
            </div>
            
            {program.capacity && (
              <span className="text-xs text-muted-foreground">
                {program.remainingSlots}/{program.capacity}명
              </span>
            )}
          </div>

          {/* 태그 */}
          {program.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {program.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
              {program.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{program.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 접근성 정보 */}
          <div className="flex items-center space-x-3 text-xs">
            {program.accessibility.wheelchairAccessible && (
              <span className="flex items-center space-x-1 text-green-600">
                <span>♿</span>
                <span>휠체어</span>
              </span>
            )}
            {program.accessibility.signLanguage && (
              <span className="flex items-center space-x-1 text-blue-600">
                <span>🤟</span>
                <span>수어</span>
              </span>
            )}
            {program.accessibility.audioDescription && (
              <span className="flex items-center space-x-1 text-purple-600">
                <span>🎧</span>
                <span>음성해설</span>
              </span>
            )}
          </div>
        </div>

        {/* 카드 푸터 */}
        <div className="p-4 pt-0">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/programs/${program.id}`}>
              자세히 보기
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}