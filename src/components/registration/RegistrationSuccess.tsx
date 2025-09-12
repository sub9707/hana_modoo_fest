'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/auth'

interface Registration {
    id: string
    registrationNumber: string
    createdAt: string
    status: string
    participantType: string
    companions: number
    selectedPrograms: string[]
    email: string
    smsConsent: boolean
    marketingConsent: boolean
}

interface RegistrationSuccessProps {
    user: User
    registration: Registration
}

export default function RegistrationSuccess({ user, registration }: RegistrationSuccessProps) {
    const router = useRouter()
    const cardRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)

    // 임시 UUID (실제로는 registration.id 사용)
    const tempUUID = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // 참가유형 한글 변환
    const getParticipantTypeText = (type: string) => {
        const types = {
            'citizen': '일반 시민/가족',
            'single-parent': '한부모가족',
            'self-help': '자조모임',
            'volunteer': '자원봉사자',
            'organization': '기관 관계자'
        }
        return types[type as keyof typeof types] || type
    }

    // 이미지 다운로드
    const downloadCard = async () => {
        if (!cardRef.current) return

        setIsDownloading(true)

        try {
            const html2canvas = (await import('html2canvas')).default

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null, // 실제 배경 유지
                scale: 2,
                useCORS: true,
            })

            const link = document.createElement('a')
            link.download = `모두하나대축제2025_접수증_${registration.registrationNumber}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()

        } catch (error) {
            console.error('Download error:', error)
            alert('이미지 다운로드 중 오류가 발생했습니다.')
        } finally {
            setIsDownloading(false)
        }
    }


    // 공유하기
    const handleShare = async (platform: string) => {
        setIsSharing(true)

        const shareText = `모두하나대축제 2025에 사전신청했어요! 🎉\n\n📅 2025년 10월 18일 (토) 11:00-16:00\n📍 여의도공원 문화의마당\n\n#모두하나대축제2025 #가족축제 #서울시`
        const shareUrl = 'https://moduhana2025.seoul.kr'

        try {
            switch (platform) {
                case 'copy':
                    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
                    alert('링크가 복사되었습니다!')
                    break

                case 'native':
                    if (navigator.share) {
                        await navigator.share({
                            title: '모두하나대축제 2025',
                            text: shareText,
                            url: shareUrl,
                        })
                    }
                    break
            }
        } catch (error) {
            console.error('Share error:', error)
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">신청 완료!</h1>
                    <p className="text-xl md:text-2xl opacity-90">
                        모두하나대축제 2025 사전참가 신청이 완료되었습니다
                    </p>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">

                    {/* 접수증 카드 */}
                    <div className="space-y-6">
                        <div
                            ref={cardRef}
                            className="bg-white rounded-xl shadow-lg p-8 relative border border-gray-200"
                            style={{ background: '#ffffff' }}
                        >
                            {/* UUID */}
                            <div className="absolute top-4 left-4 text-xs text-gray-400 font-mono">
                                {tempUUID}
                            </div>

                            {/* 접수 완료 뱃지 */}
                            <div className="text-center mb-8 pt-6">
                                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium text-lg">
                                    <span className="text-2xl">✅</span>
                                    <span>접수 완료</span>
                                </div>
                            </div>

                            {/* 접수번호 */}
                            <div className="text-center mb-8">
                                <div className="text-gray-600 text-lg mb-2">접수번호</div>
                                <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 py-6 px-8 rounded-xl inline-block">
                                    {registration.registrationNumber}
                                </div>
                            </div>

                            {/* 상세 정보 */}
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">신청자</span>
                                        <span className="text-gray-800 font-semibold">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">참가인원</span>
                                        <span className="text-gray-800 font-semibold">{registration.companions + 1}명 (본인 포함)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">참가유형</span>
                                        <span className="text-gray-800 font-semibold">{getParticipantTypeText(registration.participantType)}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">신청일시</span>
                                        <span className="text-gray-800 font-semibold">{formatDate(registration.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">연락처</span>
                                        <span className="text-gray-800 font-semibold">{user.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-500 font-medium">이메일</span>
                                        <span className="text-gray-800 font-semibold">{registration.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 축제 정보 */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎪 모두하나대축제 2025</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl mb-2">📅</div>
                                        <div className="font-semibold text-gray-800">일시</div>
                                        <div className="text-sm text-gray-600">2025.10.18 (토)</div>
                                        <div className="text-sm text-gray-600">11:00-16:00</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-2">📍</div>
                                        <div className="font-semibold text-gray-800">장소</div>
                                        <div className="text-sm text-gray-600">여의도공원</div>
                                        <div className="text-sm text-gray-600">문화의마당</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl mb-2">🎟️</div>
                                        <div className="font-semibold text-gray-800">입장</div>
                                        <div className="text-sm text-gray-600">무료 입장</div>
                                        <div className="text-sm text-gray-600">접수번호 지참</div>
                                    </div>
                                </div>
                            </div>

                            {/* 주관 기관 */}
                            <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                                <div className="mb-1">주최: 서울특별시 | 주관: 서울특별시한부모가족지원센터</div>
                                <div>문의: 02-000-0000 | info@moduhana2025.seoul.kr</div>
                            </div>
                        </div>

                        {/* 다운로드 버튼 */}
                        <div className="text-center">
                            <button
                                onClick={downloadCard}
                                disabled={isDownloading}
                                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>이미지 생성 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">📥</span>
                                        <span>접수증 이미지 다운로드</span>
                                    </>
                                )}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                접수증을 이미지로 저장하여 휴대폰에 보관하세요
                            </p>
                        </div>
                    </div>

                    {/* 준비물 안내 */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎒 준비물 안내</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                '편안한 복장 및 운동화 착용',
                                '개인 물병 및 간단한 간식',
                                '모자, 선크림 등 자외선 차단용품',
                                '휴대폰 충전기 (포토존 이용 시)',
                                '개인 손수건 및 휴지',
                                '아이 동반 시: 기저귀, 젖병 등',
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-blue-500 font-bold">✓</div>
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                            <div className="font-semibold text-yellow-800 mb-2">🌤️ 날씨 안내</div>
                            <p className="text-yellow-700">
                                야외 행사로 진행되니 날씨에 맞는 준비를 해주세요.
                                우천 시에도 실내 프로그램이 진행됩니다.
                            </p>
                        </div>
                    </div>

                    {/* 알림 및 문의 */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">📞 알림 및 문의</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 mb-3">알림 서비스</h3>
                                <div className="space-y-2 text-sm">
                                    {registration.smsConsent && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <span>✅</span>
                                            <span>SMS 알림 설정됨</span>
                                        </div>
                                    )}
                                    {registration.marketingConsent && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <span>✅</span>
                                            <span>이메일 알림 설정됨</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-800 mb-3">문의처</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>📧 info@moduhana2025.seoul.kr</div>
                                    <div>📞 02-000-0000 (평일 9:00-18:00)</div>
                                    <div>🌐 홈페이지 공지사항 확인</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 공유하기 */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">카카오톡 공유</h2>
                        <p className="mb-6 opacity-90">인증서를 카카오톡으로 공유하세요</p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => handleShare('copy')}
                                disabled={isSharing}
                                className="flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                <span>📋</span>
                                <span>링크 복사</span>
                            </button>

                            <button
                                onClick={() => handleShare('native')}
                                disabled={isSharing}
                                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors disabled:opacity-50"
                            >
                                <span>📤</span>
                                <span>공유하기</span>
                            </button>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push('/news')}
                            className="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            축제 소식 보기
                        </button>
                        <button
                            onClick={() => router.push('/directions')}
                            className="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                        >
                            오시는 길 확인
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}