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

    // 이미지 다운로드 (html2canvas 호환성 개선)
    const downloadCard = async () => {
        if (!cardRef.current) return

        setIsDownloading(true)

        try {
            const html2canvas = (await import('html2canvas')).default

            // html2canvas 옵션 최적화
            const canvas = await html2canvas(cardRef.current, {
                background: '#ffffff', // 명시적 배경색 설정 (backgroundColor → background)
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                // Tailwind 4.x 호환성을 위한 설정
                ignoreElements: (element: Element): boolean => {
                    // 문제가 되는 요소들을 건너뛸 수 있도록 설정
                    return (element as HTMLElement).classList?.contains('ignore-canvas') || false
                },
                onclone: (clonedDoc: Document) => {
                    // 클론된 문서에서 lab() 색상 함수 제거
                    const style = clonedDoc.createElement('style')
                    style.textContent = `
                        * {
                            background: inherit !important;
                            color: inherit !important;
                        }
                        .gradient-bg {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        }
                        .gradient-purple {
                            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;
                        }
                        .gradient-festival {
                            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%) !important;
                        }
                    `
                    clonedDoc.head.appendChild(style)
                }
            } as any)

            const link = document.createElement('a')
            link.download = `모두하나대축제2025_접수증_${registration.registrationNumber}.png`
            link.href = canvas.toDataURL('image/png', 1.0)
            link.click()

        } catch (error) {
            console.error('Download error:', error)
            alert('이미지 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setIsDownloading(false)
        }
    }

    // 공유하기
    const handleShare = async (platform: string) => {
        setIsSharing(true)

        const shareText = `🎉 모두하나대축제 2025에 사전신청했어요!\n\n📅 2025년 10월 18일 (토) 11:00-16:00\n📍 여의도공원 문화의마당\n\n함께 참여해요! #모두하나대축제2025 #가족축제 #서울시`
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
                            title: '모두하나대축제 2025 - 접수 완료',
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
        <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
            {/* 헤더 - 더 화려한 그라데이션 */}
            <div 
                className="text-white py-20 relative overflow-hidden"
                style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                }}
            >
                {/* 배경 장식 원들 */}
                <div className="absolute inset-0 overflow-hidden">
                    <div 
                        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    ></div>
                    <div 
                        className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full opacity-20"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    ></div>
                    <div 
                        className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full opacity-10"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    ></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="text-7xl mb-8 animate-bounce">🎉</div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-white">
                        신청 완료!
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 font-light">
                        모두하나대축제 2025 사전참가 신청이 완료되었습니다
                    </p>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">

                    {/* 접수증 카드 - 더 예쁜 디자인 */}
                    <div className="space-y-6">
                        <div
                            ref={cardRef}
                            className="relative overflow-hidden"
                            style={{ 
                                backgroundColor: '#ffffff',
                                borderRadius: '24px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            {/* 카드 배경 장식 */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div 
                                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-5"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                                ></div>
                                <div 
                                    className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-5"
                                    style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)' }}
                                ></div>
                            </div>

                            <div className="relative z-10 p-8">
                                {/* UUID */}
                                <div className="absolute top-4 left-4 text-xs font-mono opacity-40">
                                    {tempUUID}
                                </div>

                                {/* 접수 완료 뱃지 - 더 화려하게 */}
                                <div className="text-center mb-8 pt-6">
                                    <div 
                                        className="inline-flex items-center space-x-3 px-8 py-4 rounded-md font-bold text-lg text-white shadow-lg"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                                        }}
                                    >
                                        <span className="text-2xl">✅</span>
                                        <span>접수 완료</span>
                                    </div>
                                </div>

                                {/* 접수번호 - 더 눈에 띄게 */}
                                <div className="text-center mb-10">
                                    <div className="text-lg font-medium mb-3" style={{ color: '#6b7280' }}>
                                        접수번호
                                    </div>
                                    <div 
                                        className="inline-block px-8 py-6 rounded-2xl font-mono font-bold text-4xl text-white shadow-xl"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)'
                                        }}
                                    >
                                        {registration.registrationNumber}
                                    </div>
                                </div>

                                {/* 상세 정보 - 카드 스타일로 */}
                                <div className="grid md:grid-cols-2 gap-6 mb-10">
                                    <div className="space-y-4">
                                        {[
                                            { label: '신청자', value: user.name, icon: '👤' },
                                            { label: '참가인원', value: `${registration.companions + 1}명 (본인 포함)`, icon: '👥' },
                                            { label: '참가유형', value: getParticipantTypeText(registration.participantType), icon: '🏷️' }
                                        ].map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-4 rounded-xl"
                                                style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="font-medium" style={{ color: '#64748b' }}>{item.label}</span>
                                                </div>
                                                <span className="font-bold" style={{ color: '#1e293b' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: '신청일시', value: formatDate(registration.createdAt), icon: '📅' },
                                            { label: '연락처', value: user.phone, icon: '📞' },
                                            { label: '이메일', value: registration.email, icon: '📧' }
                                        ].map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-4 rounded-xl"
                                                style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="font-medium" style={{ color: '#64748b' }}>{item.label}</span>
                                                </div>
                                                <span className="font-bold" style={{ color: '#1e293b' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 축제 정보 - 더 화려하게 */}
                                <div 
                                    className="rounded-2xl p-8 mb-8 relative overflow-hidden"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #ddd6fe 0%, #fae8ff 50%, #fef3c7 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-10">
                                        <div 
                                            className="absolute top-0 right-0 w-32 h-32 rounded-full"
                                            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
                                        ></div>
                                        <div 
                                            className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
                                            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
                                        ></div>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#374151' }}>
                                            🎪 모두하나대축제 2025 🎪
                                        </h3>
                                        <div className="grid grid-cols-3 gap-6 text-center">
                                            {[
                                                { icon: '📅', title: '일시', line1: '2025.10.18 (토)', line2: '11:00-16:00' },
                                                { icon: '📍', title: '장소', line1: '여의도공원', line2: '문화의마당' },
                                                { icon: '🎟️', title: '입장', line1: '무료 입장', line2: '접수번호 지참' }
                                            ].map((item, index) => (
                                                <div 
                                                    key={index}
                                                    className="p-4 rounded-xl bg-white bg-opacity-60 backdrop-blur-sm"
                                                >
                                                    <div className="text-3xl mb-3">{item.icon}</div>
                                                    <div className="font-bold text-lg mb-2" style={{ color: '#374151' }}>{item.title}</div>
                                                    <div className="text-sm font-medium" style={{ color: '#6b7280' }}>{item.line1}</div>
                                                    <div className="text-sm font-medium" style={{ color: '#6b7280' }}>{item.line2}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 주관 기관 */}
                                <div className="text-center text-sm border-t pt-6" style={{ 
                                    borderColor: '#e5e7eb',
                                    color: '#9ca3af'
                                }}>
                                    <div className="mb-2 font-medium">주최: 서울특별시 | 주관: 서울특별시한부모가족지원센터</div>
                                    <div>문의: 02-000-0000 | info@moduhana2025.seoul.kr</div>
                                </div>
                            </div>
                        </div>

                        {/* 다운로드 버튼 - 더 매력적으로 */}
                        <div className="text-center">
                            <button
                                onClick={downloadCard}
                                disabled={isDownloading}
                                className="relative group"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                                    opacity: isDownloading ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDownloading) {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(59, 130, 246, 0.4)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDownloading) {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                                    }
                                }}
                            >
                                {isDownloading ? (
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            style={{ animation: 'spin 1s linear infinite' }}
                                        ></div>
                                        <span>이미지 생성 중...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">📥</span>
                                        <span>접수증 이미지 다운로드</span>
                                        <span className="text-xl">✨</span>
                                    </div>
                                )}
                            </button>
                            <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
                                접수증을 이미지로 저장하여 휴대폰에 보관하세요
                            </p>
                        </div>
                    </div>

                    {/* 준비물 안내 - 더 시각적으로 */}
                    <div 
                        className="rounded-2xl p-8 shadow-lg"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#1f2937' }}>
                            🎒 준비물 안내
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {[
                                { icon: '👕', text: '편안한 복장 및 운동화 착용' },
                                { icon: '💧', text: '개인 물병 및 간단한 간식' },
                                { icon: '🧴', text: '모자, 선크림 등 자외선 차단용품' },
                                { icon: '🔋', text: '휴대폰 충전기 (포토존 이용 시)' },
                                { icon: '🧻', text: '개인 손수건 및 휴지' },
                                { icon: '👶', text: '아이 동반 시: 기저귀, 젖병 등' },
                            ].map((item, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:scale-105"
                                    style={{ 
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        cursor: 'default'
                                    }}
                                >
                                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                                    <span className="font-medium" style={{ color: '#374151' }}>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div 
                            className="p-6 rounded-xl border-l-4"
                            style={{ 
                                backgroundColor: '#fef3c7',
                                borderLeftColor: '#f59e0b',
                                border: '1px solid #fcd34d'
                            }}
                        >
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-2xl">🌤️</span>
                                <div className="font-bold text-lg" style={{ color: '#92400e' }}>날씨 안내</div>
                            </div>
                            <p style={{ color: '#a16207' }}>
                                야외 행사로 진행되니 날씨에 맞는 준비를 해주세요.
                                우천 시에도 실내 프로그램이 진행됩니다.
                            </p>
                        </div>
                    </div>

                    {/* 알림 및 문의 */}
                    <div 
                        className="rounded-2xl p-8 shadow-lg"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#1f2937' }}>
                            📞 알림 및 문의
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div 
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                            >
                                <h3 className="font-bold text-xl mb-4 flex items-center space-x-2" style={{ color: '#166534' }}>
                                    <span>🔔</span>
                                    <span>알림 서비스</span>
                                </h3>
                                <div className="space-y-3">
                                    {registration.smsConsent && (
                                        <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                                            <span className="text-xl">✅</span>
                                            <span className="font-medium" style={{ color: '#166534' }}>SMS 알림 설정됨</span>
                                        </div>
                                    )}
                                    {registration.marketingConsent && (
                                        <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                                            <span className="text-xl">✅</span>
                                            <span className="font-medium" style={{ color: '#166534' }}>이메일 알림 설정됨</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div 
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}
                            >
                                <h3 className="font-bold text-xl mb-4 flex items-center space-x-2" style={{ color: '#1e40af' }}>
                                    <span>💬</span>
                                    <span>문의처</span>
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: '📧', text: 'info@moduhana2025.seoul.kr' },
                                        { icon: '📞', text: '02-000-0000 (평일 9:00-18:00)' },
                                        { icon: '🌐', text: '홈페이지 공지사항 확인' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium" style={{ color: '#1e40af' }}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 공유하기 - 더 화려하게 */}
                    <div 
                        className="relative rounded-2xl p-8 text-white text-center overflow-hidden"
                        style={{ 
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)'
                        }}
                    >
                        {/* 배경 장식 */}
                        <div className="absolute inset-0 opacity-20">
                            <div 
                                className="absolute top-0 left-0 w-32 h-32 rounded-full"
                                style={{ background: 'radial-gradient(circle, white, transparent)' }}
                            ></div>
                            <div 
                                className="absolute bottom-0 right-0 w-40 h-40 rounded-full"
                                style={{ background: 'radial-gradient(circle, white, transparent)' }}
                            ></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
                                <span>📱</span>
                                <span>친구들과 공유하기</span>
                                <span>✨</span>
                            </h2>
                            <p className="text-lg mb-8 opacity-90">
                                축제 소식을 친구들과 함께 나눠보세요!
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => handleShare('copy')}
                                    disabled={isSharing}
                                    className="flex items-center space-x-3 bg-white text-gray-800 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                                    style={{ minWidth: '140px' }}
                                >
                                    <span className="text-xl">📋</span>
                                    <span>링크 복사</span>
                                </button>

                                <button
                                    onClick={() => handleShare('native')}
                                    disabled={isSharing}
                                    className="flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                                    style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        minWidth: '140px'
                                    }}
                                >
                                    <span className="text-xl">📤</span>
                                    <span>공유하기</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼들 - 더 매력적으로 */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/news')}
                            className="group relative p-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{ 
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            }}
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <span className="text-3xl">📰</span>
                                <span>축제 소식 보기</span>
                                <span className="text-sm opacity-80">최신 프로그램 안내</span>
                            </div>
                            <div 
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}
                            ></div>
                        </button>

                        <button
                            onClick={() => router.push('/directions')}
                            className="group relative p-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{ 
                                background: 'linear-gradient(135deg, #10b981, #047857)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            }}
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <span className="text-3xl">🗺️</span>
                                <span>오시는 길</span>
                                <span className="text-sm opacity-80">교통편 및 주차 안내</span>
                            </div>
                            <div 
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                            ></div>
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="group relative p-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{ 
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '2px solid #e5e7eb',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                                e.currentTarget.style.backgroundColor = '#f9fafb'
                                e.currentTarget.style.borderColor = '#d1d5db'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                                e.currentTarget.style.backgroundColor = 'white'
                                e.currentTarget.style.borderColor = '#e5e7eb'
                            }}
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <span className="text-3xl">🏠</span>
                                <span>홈으로 돌아가기</span>
                                <span className="text-sm opacity-60">메인 페이지로 이동</span>
                            </div>
                        </button>
                    </div>

                    {/* 추가 안내사항 */}
                    <div 
                        className="text-center p-8 rounded-2xl relative overflow-hidden"
                        style={{ 
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                            border: '1px solid #fbbf24'
                        }}
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div 
                                className="absolute top-0 right-0 w-20 h-20 rounded-full"
                                style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
                            ></div>
                            <div 
                                className="absolute bottom-0 left-0 w-16 h-16 rounded-full"
                                style={{ background: 'radial-gradient(circle, #d97706, transparent)' }}
                            ></div>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4" style={{ color: '#92400e' }}>
                                🎯 중요 안내사항
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 text-left">
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-lg mt-1">📱</span>
                                        <div>
                                            <div className="font-semibold" style={{ color: '#92400e' }}>접수증 필수 지참</div>
                                            <div className="text-sm" style={{ color: '#a16207' }}>
                                                다운로드한 이미지 또는 접수번호를 현장에서 제시해주세요
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="text-lg mt-1">⏰</span>
                                        <div>
                                            <div className="font-semibold" style={{ color: '#92400e' }}>행사 일정 확인</div>
                                            <div className="text-sm" style={{ color: '#a16207' }}>
                                                홈페이지에서 최신 프로그램 일정을 확인하세요
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-lg mt-1">🚗</span>
                                        <div>
                                            <div className="font-semibold" style={{ color: '#92400e' }}>교통편 이용 권장</div>
                                            <div className="text-sm" style={{ color: '#a16207' }}>
                                                주차 공간이 제한적이니 대중교통을 이용해주세요
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="text-lg mt-1">📞</span>
                                        <div>
                                            <div className="font-semibold" style={{ color: '#92400e' }}>문의사항</div>
                                            <div className="text-sm" style={{ color: '#a16207' }}>
                                                궁금한 점은 언제든지 연락 주세요
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS 애니메이션 */}
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(-25%);
                        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                    }
                    50% {
                        transform: translateY(0);
                        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                    }
                }
                
                .group:hover .group-hover\\:opacity-20 {
                    opacity: 0.2;
                }
                
                button:hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .backdrop-blur-sm {
                    backdrop-filter: blur(4px);
                }
            `}</style>
        </div>
    )
}