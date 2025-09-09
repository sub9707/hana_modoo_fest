import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Calendar, MapPin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: '참가신청 완료',
  description: '모두하나대축제 2025 참가신청이 완료되었습니다.',
}

export default function RegisterSuccessPage() {
  // 실제로는 URL 파라미터나 상태에서 신청 정보를 가져올 것
  const applicationInfo = {
    id: 'REG20250908001',
    name: '홍길동',
    email: 'hong@example.com',
    submittedAt: '2025-09-08 14:30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 성공 메시지 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            참가신청이 완료되었습니다!
          </h1>
          <p className="text-lg text-slate-600">
            신청해주셔서 감사합니다. 축제 당일 만나뵙겠습니다.
          </p>
        </div>

        {/* 신청 정보 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6">신청 정보</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">접수번호</span>
                <span className="font-mono font-medium">{applicationInfo.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">신청자</span>
                <span className="font-medium">{applicationInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">이메일</span>
                <span className="font-medium">{applicationInfo.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">신청일시</span>
                <span className="font-medium">{applicationInfo.submittedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 축제 정보 안내 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6">축제 정보 안내</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">행사 일정</p>
                  <p className="text-slate-600">2025년 10월 18일(토) 11:00-16:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">행사 장소</p>
                  <p className="text-slate-600">여의도공원 문화의마당</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 준비사항 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6">축제 당일 준비사항</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>신분증 또는 참가신청 확인서 (접수번호)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>편한 복장과 운동화 착용 권장</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>개인 물병 (급수대 운영)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>우천 시 실내 프로그램으로 변경 (별도 안내)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 연락처 안내 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6">문의사항</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <a href="tel:02-123-4567" className="text-blue-600 hover:text-blue-700">
                  02-123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <a href="mailto:info@moduhana2025.seoul.kr" className="text-blue-600 hover:text-blue-700">
                  info@moduhana2025.seoul.kr
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/programs">
              프로그램 둘러보기
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/online-festival">
              온라인 축제 참여하기
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/">
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* 공유 안내 */}
        <div className="mt-12 text-center bg-white rounded-xl p-8">
          <h3 className="text-lg font-semibold mb-4">친구들에게도 알려주세요!</h3>
          <p className="text-slate-600 mb-6">
            더 많은 분들이 함께할 수 있도록 축제를 알려주세요
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm">
              카카오톡 공유
            </Button>
            <Button variant="outline" size="sm">
              링크 복사
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}