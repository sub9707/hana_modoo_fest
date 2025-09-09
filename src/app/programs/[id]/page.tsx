import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 실제로는 API에서 프로그램 정보를 가져와서 메타데이터 생성
  return {
    title: `프로그램 상세 - ${params.id}`,
    description: '모두하나대축제 2025 프로그램 상세 정보',
  }
}

export default function ProgramDetailPage({ params }: Props) {
  // 실제로는 API에서 프로그램 데이터를 가져올 것
  const program = {
    id: params.id,
    title: '가족 콘서트',
    category: '무대공연',
    startTime: '12:00',
    endTime: '13:00',
    location: '메인 무대',
    capacity: 500,
    remainingSlots: 150,
    targetAudience: ['전체 가족', '어린이'],
    organizer: '서울시립교향악단',
    description: '온 가족이 함께 즐길 수 있는 클래식과 대중음악이 어우러진 특별한 콘서트입니다. 유명 클래식 곡부터 동요, K-POP까지 다양한 장르의 음악을 들려드립니다.',
    schedule: [
      { time: '12:00-12:10', activity: '오프닝 퍼포먼스' },
      { time: '12:10-12:30', activity: '클래식 명곡 연주' },
      { time: '12:30-12:45', activity: '동요 메들리' },
      { time: '12:45-13:00', activity: 'K-POP 커버 및 마무리' }
    ],
    requirements: [
      '별도 신청 필요 없음 (당일 현장 참여)',
      '우천 시 실내 공연장으로 이동',
      '공연 중 사진 촬영 가능'
    ],
    contact: '02-123-4567'
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/programs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              프로그램 목록으로
            </Link>
          </Button>
        </div>

        {/* 프로그램 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <Badge className="mb-4">{program.category}</Badge>
            <div className="text-right">
              <div className="text-sm text-slate-500">잔여 자리</div>
              <div className="text-lg font-bold text-green-600">
                {program.remainingSlots}/{program.capacity}명
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {program.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{program.startTime} - {program.endTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{program.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{program.targetAudience.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 프로그램 소개 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">프로그램 소개</h2>
              <p className="text-slate-700 leading-relaxed">
                {program.description}
              </p>
            </section>

            {/* 진행 일정 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">진행 일정</h2>
              <div className="space-y-3">
                {program.schedule.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-600 min-w-0">
                      {item.time}
                    </div>
                    <div className="text-sm text-slate-700">
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 유의사항 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">유의사항</h2>
              <ul className="space-y-2">
                {program.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2 text-slate-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로그램 정보 */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4">프로그램 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">주관</span>
                  <span className="font-medium">{program.organizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">정원</span>
                  <span className="font-medium">{program.capacity}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">참가비</span>
                  <span className="font-medium text-green-600">무료</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">문의</span>
                  <a href={`tel:${program.contact}`} className="font-medium text-blue-600">
                    {program.contact}
                  </a>
                </div>
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4">위치 안내</h3>
              <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-slate-700 text-center">
                {program.location}
              </p>
              <Button variant="outline" size="sm" className="w-full mt-4">
                전체 행사장 지도 보기
              </Button>
            </div>

            {/* 관련 프로그램 */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4">관련 프로그램</h3>
              <div className="space-y-3">
                {['개막식', '폐막식', '어린이 놀이터'].map((related, index) => (
                  <Link
                    key={index}
                    href={`/programs/${index + 2}`}
                    className="block p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="text-sm font-medium text-slate-900">{related}</div>
                    <div className="text-xs text-slate-500">같은 구역 프로그램</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            내 일정에 추가하기
          </Button>
          <Button variant="outline">
            공유하기
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">
              사전참가 신청하기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}