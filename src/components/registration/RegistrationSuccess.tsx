'use client'

import { useState, useRef, useEffect } from 'react'
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
    const [tempUUID, setTempUUID] = useState('')

    // 클라이언트에서만 UUID 생성 (Hydration 에러 방지)
    useEffect(() => {
        setTempUUID(`reg-${registration.id}-${Date.now().toString(36)}`)
    }, [registration.id])

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

    // 공유하기
    const shareCard = async () => {
        setIsSharing(true)

        try {
            if (navigator.share) {
                await navigator.share({
                    title: '모두하나대축제 2025 접수증',
                    text: `접수번호: ${registration.registration_number}`,
                    url: window.location.href
                })
            } else {
                // 공유 API가 지원되지 않는 경우 클립보드에 복사
                await navigator.clipboard.writeText(window.location.href)
                alert('링크가 클립보드에 복사되었습니다.')
            }
        } catch (error) {
            console.error('Share error:', error)
        } finally {
            setIsSharing(false)
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
                                {/* UUID - 클라이언트에서만 렌더링 */}
                                {tempUUID && (
                                    <div className="absolute top-4 left-4 text-xs font-mono opacity-40">
                                        {tempUUID}
                                    </div>
                                )}

                                {/* 접수 완료 뱃지 */}
                                <div className="text-center mb-8 pt-6">
                                    <div 
                                        className="inline-flex items-center space-x-3 px-8 py-4 rounded-md font-bold text-lg text-white shadow-lg"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                                        }}
                                    >
                                        <span className="text-2xl">✓</span>
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
                                            { label: '신청자', value: user.name, icon: '사람' },
                                            { label: '참가인원', value: `${registration.companions + 1}명 (본인 포함)`, icon: '그룹' },
                                            { label: '참가유형', value: getParticipantTypeText(registration.participant_type), icon: '태그' }
                                        ].map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-4 rounded-xl"
                                                style={{ backgroundColor: '#f9fafb' }}
                                            >
                                                <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
                                                    {item.label}
                                                </span>
                                                <span className="font-semibold" style={{ color: '#111827' }}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: '전화번호', value: user.phone, icon: '전화' },
                                            { label: '신청일시', value: formatDate(registration.created_at), icon: '달력' },
                                            { label: '상태', value: '확정', icon: '체크' }
                                        ].map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-4 rounded-xl"
                                                style={{ backgroundColor: '#f9fafb' }}
                                            >
                                                <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
                                                    {item.label}
                                                </span>
                                                <span className="font-semibold" style={{ color: '#111827' }}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 배송지 정보 */}
                                <div 
                                    className="p-6 rounded-xl mb-8"
                                    style={{ backgroundColor: '#fef3c7', border: '2px dashed #f59e0b' }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">📦</span>
                                        <div className="flex-1">
                                            <div className="font-bold mb-2" style={{ color: '#92400e' }}>
                                                경품 배송지
                                            </div>
                                            <div className="text-sm space-y-1" style={{ color: '#78350f' }}>
                                                <div>({registration.zip_code}) {registration.address}</div>
                                                {registration.address_detail && (
                                                    <div>{registration.address_detail}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 특별 요청사항 */}
                                {registration.special_requests && (
                                    <div 
                                        className="p-6 rounded-xl"
                                        style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <span className="text-2xl">💬</span>
                                            <div className="flex-1">
                                                <div className="font-bold mb-2" style={{ color: '#166534' }}>
                                                    특별 요청사항
                                                </div>
                                                <div className="text-sm" style={{ color: '#15803d' }}>
                                                    {registration.special_requests}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 다운로드 버튼 */}
                        <div className="text-center space-y-4">
                            <button
                                onClick={downloadCard}
                                disabled={isDownloading}
                                className="inline-block px-10 py-5 rounded-2xl font-bold text-lg text-white w-full md:w-auto"
                                style={{ 
                                    background: isDownloading 
                                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                                        : 'linear-gradient(135deg, #f97316, #ec4899)',
                                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)',
                                    opacity: isDownloading ? 0.7 : 1
                                }}
                            >
                                {isDownloading ? (
                                    <div className="flex items-center justify-center space-x-3">
                                        <div 
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            style={{ animation: 'spin 1s linear infinite' }}
                                        ></div>
                                        <span>이미지 생성 중...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-3">
                                        <span>접수증 다운로드</span>
                                    </div>
                                )}
                            </button>
                            <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
                                접수증을 이미지로 저장하여 휴대폰에 보관하세요
                            </p>
                        </div>
                    </div>

                    {/* 안내 사항 */}
                    <div 
                        className="p-8 rounded-2xl space-y-6"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>
                            안내 사항
                        </h2>
                        <div className="space-y-4">
                            {[
                                '행사 당일 접수번호를 제시해주시기 바랍니다.',
                                '경품 추첨 결과는 행사 종료 후 개별 연락드립니다.',
                                '등록하신 주소로 경품이 배송될 예정입니다.',
                                '문의사항은 고객센터(02-1234-5678)로 연락 주세요.'
                            ].map((text, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <span className="text-orange-500 font-bold flex-shrink-0 mt-1">•</span>
                                    <span style={{ color: '#4b5563' }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all"
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#f97316',
                                border: '2px solid #f97316',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            홈으로 돌아가기
                        </button>
                        <button
                            onClick={() => router.push('/my-page')}
                            className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ec4899)',
                                boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)'
                            }}
                        >
                            마이페이지로 이동
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}