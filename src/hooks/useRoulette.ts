// hooks/useRouletteEvent.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type {
    RouletteState,
    PrizeWithProbability,
    SpinResponse,
    RecentWinner,
    ApiResponse
} from '@/types/event'

interface UseRouletteEventReturn extends RouletteState {
    prizes: PrizeWithProbability[]
    recentWinners: RecentWinner[]
    spin: () => Promise<void>
    resetResult: () => void
    refreshData: () => Promise<void>
    serverLoad: 'low' | 'medium' | 'high'
}

export function useRouletteEvent(): UseRouletteEventReturn {
    const { user } = useAuth()

    const [state, setState] = useState<RouletteState>({
        isSpinning: false,
        canParticipate: true,
        hasParticipatedToday: false,
        currentRotation: 0,
        result: null,
        isLoading: true,
        error: null
    })

    const [prizes, setPrizes] = useState<PrizeWithProbability[]>([])
    const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([])
    const [serverLoad, setServerLoad] = useState<'low' | 'medium' | 'high'>('low')

    // 상품 목록 조회
    const fetchPrizes = useCallback(async () => {
        try {
            const response = await fetch('/api/event/prizes', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })

            const data: ApiResponse<PrizeWithProbability[]> = await response.json()

            if (data.success && data.data) {
                setPrizes(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch prizes:', error)
        }
    }, [])

    // 최근 당첨자 조회
    const fetchRecentWinners = useCallback(async () => {
        try {
            const response = await fetch('/api/event/winners/recent', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })

            const data: ApiResponse<RecentWinner[]> = await response.json()

            if (data.success && data.data) {
                setRecentWinners(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch recent winners:', error)
        }
    }, [])

    // 참여 가능 여부 확인
    const checkParticipation = useCallback(async () => {
        try {
            // 🚀 로그인하지 않은 경우 처리
            if (!user) {
                setState(prev => ({
                    ...prev,
                    canParticipate: false, // 로그인 안 한 경우만 false
                    hasParticipatedToday: false,
                    isLoading: false
                }))
                return
            }

            const response = await fetch('/api/event/participation/check', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })

            console.log('🔍 Participation API response:', response.status, response.ok)

            if (!response.ok) {
                console.warn('Participation API failed:', response.status)
                // 🚀 API 실패 시 기본값으로 처리 (로그인된 사용자는 기본 참여 가능)
                setState(prev => ({
                    ...prev,
                    canParticipate: true, // API 실패 시 참여 가능으로 설정
                    hasParticipatedToday: false,
                    isLoading: false
                }))
                return
            }

            const data: ApiResponse = await response.json()
            console.log('🔍 Participation API data:', data)

            if (data.success && data.data) {
                setState(prev => ({
                    ...prev,
                    canParticipate: data.data.can_participate ?? true, // 🚀 null 처리
                    hasParticipatedToday: data.data.has_participated_today ?? false,
                    isLoading: false
                }))
            } else {
                console.warn('Participation API returned error:', data.error)
                // 🚀 API 응답이 실패여도 기본값으로 처리
                setState(prev => ({
                    ...prev,
                    canParticipate: true,
                    hasParticipatedToday: false,
                    isLoading: false
                }))
            }
        } catch (error) {
            console.error('Failed to check participation:', error)
            // 🚀 에러 발생 시 참여 가능으로 설정 (더 관대한 처리)
            setState(prev => ({
                ...prev,
                canParticipate: true, // 에러 시에도 참여 가능
                hasParticipatedToday: false,
                isLoading: false,
                error: null // 참여 확인 실패는 치명적 에러가 아님
            }))
        }
    }, [user])

    useEffect(() => {
        checkParticipation()
    }, [checkParticipation, user])

    // 서버 부하 상태 모니터링 (간단한 응답 시간 기반)
    const checkServerLoad = useCallback(async () => {
        const startTime = Date.now()
        const controller = new AbortController()

        // 5초 타임아웃 설정
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                cache: 'no-store',
                signal: controller.signal,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                setServerLoad('high')
                return
            }

            const data = await response.json()
            const responseTime = Date.now() - startTime

            // API 응답의 load 값을 우선 사용
            if (data.load) {
                setServerLoad(data.load)
                return
            }

            // 환경별 기준 적용
            const isDev = process.env.NODE_ENV === 'development'
            const thresholds = isDev
                ? { good: 1000, fair: 2000 }
                : { good: 200, fair: 500 }

            if (responseTime < thresholds.good) {
                setServerLoad('low')
            } else if (responseTime < thresholds.fair) {
                setServerLoad('medium')
            } else {
                setServerLoad('high')
            }

        } catch (error) {
            clearTimeout(timeoutId)
            console.warn('Server load check failed:', error)

            // 네트워크 오류 시 중간 부하로 설정 (high로 하지 않음)
            if (error instanceof Error && error.name === 'AbortError') {
                setServerLoad('high') // 타임아웃은 high
            } else {
                setServerLoad('medium') // 기타 오류는 medium
            }
        }
    }, [])

    // 룰렛 실행
    const spin = useCallback(async () => {
        if (!user) {
            setState(prev => ({
                ...prev,
                error: '로그인이 필요합니다.'
            }))
            return
        }

        if (state.isSpinning || !state.canParticipate) {
            return
        }

        setState(prev => ({
            ...prev,
            isSpinning: true,
            error: null,
            result: null
        }))

        try {
            // 서버 부하 체크
            checkServerLoad().catch(console.warn)

            const waitTime = serverLoad === 'high' ? 1500 :
                serverLoad === 'medium' ? 500 : 0

            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime))
            }

            const response = await fetch('/api/event/roulette/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            })


            const data: SpinResponse = await response.json()

            if (data.success && data.data) {
                // 룰렛 애니메이션 계산
                const prizeIndex = prizes.findIndex(p => p.id === data.data!.prize.id)
                const sectionAngle = 360 / prizes.length
                const targetAngle = (360 - (prizeIndex * sectionAngle + sectionAngle / 2)) % 360

                // 더 자연스러운 회전 계산
                const baseSpins = 8 + Math.random() * 4 // 8-12바퀴 회전
                const finalRotation = state.currentRotation + baseSpins * 360 + targetAngle

                setState(prev => ({
                    ...prev,
                    currentRotation: finalRotation
                }))

                // 애니메이션 지속 시간 후 결과 표시
                setTimeout(() => {
                    setState(prev => ({
                        ...prev,
                        isSpinning: false,
                        canParticipate: false,
                        hasParticipatedToday: true,
                        result: {
                            success: true,
                            prize: data.data!.prize,
                            participation_id: data.data!.participation_id,
                            winner_id: data.data!.winner_id,
                            remaining_quantity: data.data!.remaining_quantity
                        }
                    }))

                    // 당첨자 목록 새로고침
                    if (data.data!.winner_id) {
                        setTimeout(() => {
                            fetchRecentWinners()
                        }, 1000)
                    }
                }, 4000)

            } else {
                setState(prev => ({
                    ...prev,
                    isSpinning: false,
                    error: data.error || '룰렛 실행 중 오류가 발생했습니다.'
                }))
            }
        } catch (error) {
            console.error('Spin error:', error)
            setState(prev => ({
                ...prev,
                isSpinning: false,
                error: '네트워크 오류가 발생했습니다.'
            }))
        }
    }, [user, state.isSpinning, state.canParticipate, state.currentRotation, prizes, serverLoad, checkServerLoad, fetchRecentWinners])

    // 결과 초기화
    const resetResult = useCallback(() => {
        setState(prev => ({
            ...prev,
            result: null,
            error: null
        }))
    }, [])

    // 전체 데이터 새로고침
    const refreshData = useCallback(async () => {
        setState(prev => ({
            ...prev,
            isLoading: true
        }))

        await Promise.all([
            fetchPrizes(),
            fetchRecentWinners(),
            checkParticipation(),
            checkServerLoad()
        ])
    }, [fetchPrizes, fetchRecentWinners, checkParticipation, checkServerLoad])

    // 초기 데이터 로드
    useEffect(() => {
        refreshData()
    }, [refreshData])

    // 주기적 데이터 갱신 (당첨자 목록)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!state.isSpinning) {
                fetchRecentWinners()
                checkServerLoad()
            }
        }, 30000) // 30초마다 갱신

        return () => clearInterval(interval)
    }, [state.isSpinning, fetchRecentWinners, checkServerLoad])

    return {
        ...state,
        prizes,
        recentWinners,
        serverLoad,
        spin,
        resetResult,
        refreshData
    }
}