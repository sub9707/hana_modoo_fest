'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/auth'
import type { Registration } from '@/types/registration'

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
    const tempUUID = `reg-${registration.id}-${Date.now().toString(36)}`

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

            const canvas = await html2canvas(cardRef.current, {
                background: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                ignoreElements: (element: Element): boolean => {
                    return (element as HTMLElement).classList?.contains('ignore-canvas') || false
                },
                onclone: (clonedDoc: Document) => {
                    const style = clonedDoc.createElement('style')
                    style.textContent = `
                        * {
                            background: inherit !important;
                            color: inherit !important;
                        }
                        .gradient-orange {
                            background: linear-gradient(135deg, #f97316 0%, #ec4899 100%) !important;
                        }
                    `
                    clonedDoc.head.appendChild(style)
                }
            } as any)

            const link = document.createElement('a')
            link.download = `모두하나대축제2025_접수증_${registration.registration_number}.png`
            link.href = canvas.toDataURL('image/png', 1.0)
            link.click()

        } catch (error) {
            console.error('Download error:', error)
            alert('이미지 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="min-h-screen font-paper" style={{ backgroundColor: '#f8fafc' }}>
            {/* 헤더 - 오렌지-핑크 그라데이션 */}
            <div 
                className="text-white py-20 relative overflow-hidden"
                style={{ 
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #f59e0b 100%)',
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

                    {/* 접수증 카드 */}
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
                                    style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
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

                                {/* 접수 완료 뱃지 */}
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

                                {/* 접수번호 */}
                                <div className="text-center mb-10">
                                    <div className="text-lg font-medium mb-3" style={{ color: '#6b7280' }}>
                                        접수번호
                                    </div>
                                    <div 
                                        className="inline-block px-8 py-6 rounded-2xl font-mono font-bold text-4xl text-white shadow-xl"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                            boxShadow: '0 20px 40px -10px rgba(249, 115, 22, 0.3)'
                                        }}
                                    >
                                        {registration.registration_number}
                                    </div>
                                </div>

                                {/* 상세 정보 */}
                                <div className="grid md:grid-cols-2 gap-6 mb-10">
                                    <div className="space-y-4">
                                        {[
                                            { label: '신청자', value: user.name, icon: '👤' },
                                            { label: '참가인원', value: `${registration.companions + 1}명 (본인 포함)`, icon: '👥' },
                                            { label: '참가유형', value: getParticipantTypeText(registration.participant_type), icon: '🏷️' }
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
                                            { label: '신청일시', value: formatDate(registration.created_at), icon: '📅' },
                                            { label: '연락처', value: user.phone, icon: '📞' },
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
                                                <span className="font-bold text-sm" style={{ color: '#1e293b' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 경품 수령 주소 */}
                                <div className="mb-8">
                                    <h4 className="font-bold text-lg mb-4" style={{ color: '#374151' }}>
                                        🏠 경품 수령 주소
                                    </h4>
                                    <div 
                                        className="p-4 rounded-xl"
                                        style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}
                                    >
                                        <div className="font-medium" style={{ color: '#92400e' }}>
                                            [{registration.zip_code}] {registration.address}
                                            {registration.address_detail && ` ${registration.address_detail}`}
                                        </div>
                                    </div>
                                </div>

                                {/* 축제 정보 */}
                                <div 
                                    className="rounded-2xl p-8 mb-8 relative overflow-hidden"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fae8ff 50%, #ddd6fe 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }}
                                >
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

                        {/* 다운로드 버튼 */}
                        <div className="text-center">
                            <button
                                onClick={downloadCard}
                                disabled={isDownloading}
                                className="relative group"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)',
                                    opacity: isDownloading ? 0.7 : 1
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
                                        <span className="text-xl">💾</span>
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
                </div>
            </div>
        </div>
    )
}