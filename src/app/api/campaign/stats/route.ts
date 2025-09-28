import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

interface CampaignStatsData {
    preregistration_count: number
    comment_count: number
    writing_count: number
    total_participants: number
    active_campaigns: number
}

// 메모리 캐시 설정
interface CacheEntry {
    data: CampaignStatsData
    timestamp: number
    ttl: number
}

let statsCache: CacheEntry | null = null
const CACHE_TTL = 30 * 1000 // 30초 캐시

// 안전한 숫자 변환 함수
function safeParseInt(value: any): number {
    if (typeof value === 'number') return Math.max(0, Math.floor(value))
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10)
        return isNaN(parsed) ? 0 : Math.max(0, parsed)
    }
    return 0
}

// 캐시 유효성 검사
function isCacheValid(cache: CacheEntry | null): boolean {
    if (!cache) return false
    const now = Date.now()
    return (now - cache.timestamp) < cache.ttl
}

// 캐시에서 데이터 가져오기
function getCachedData(): CampaignStatsData | null {
    if (isCacheValid(statsCache)) {
        const remainingTime = Math.round((statsCache!.ttl - (Date.now() - statsCache!.timestamp)) / 1000)
        return statsCache!.data
    }
    return null
}

// 캐시에 데이터 저장
function setCacheData(data: CampaignStatsData): void {
    statsCache = {
        data,
        timestamp: Date.now(),
        ttl: CACHE_TTL
    }
}

// DB에서 실제 데이터 조회 (타입 변환 포함)
async function getCampaignStatsFromDB(): Promise<CampaignStatsData> {
    try {
        
        // 등록 통계 조회 (confirmed 상태만) - CAST로 명시적 숫자 변환
        const [regResult] = await query(`
            SELECT 
                CAST(COUNT(*) AS UNSIGNED) as confirmed_count,
                CAST(COALESCE(SUM(companions), 0) AS UNSIGNED) as total_companions
            FROM registrations 
            WHERE status = 'confirmed'
        `)

        // 기타 캠페인 통계 - CAST로 명시적 숫자 변환
        const [otherResult] = await query(`
            SELECT 
                CAST((SELECT COUNT(*) FROM support_comments) AS UNSIGNED) as comment_count,
                CAST((SELECT COUNT(*) FROM writings WHERE topic IN ('가족에게 전하고 싶은 말', '가족과 함께해서 즐거웠던 순간')) AS UNSIGNED) as writing_count
        `)

        const regData = regResult || {}
        const otherData = otherResult || {}

        // 안전한 숫자 변환
        const confirmedRegistrations = safeParseInt(regData.confirmed_count)
        const totalCompanions = safeParseInt(regData.total_companions)
        const commentCount = safeParseInt(otherData.comment_count)
        const writingCount = safeParseInt(otherData.writing_count)
        const totalParticipants = confirmedRegistrations + totalCompanions

        const result: CampaignStatsData = {
            preregistration_count: confirmedRegistrations,
            comment_count: commentCount,
            writing_count: writingCount,
            total_participants: totalParticipants,
            active_campaigns: 3
        }
        
        // 타입 검증
        const isValidTypes = 
            typeof result.preregistration_count === 'number' &&
            typeof result.comment_count === 'number' &&
            typeof result.writing_count === 'number' &&
            typeof result.total_participants === 'number' &&
            typeof result.active_campaigns === 'number'

        if (!isValidTypes) {
            console.error('❌ 타입 변환 실패:', result)
            throw new Error('Type conversion failed')
        }

        return result

    } catch (error) {
        console.error('❌ DB 통계 조회 오류:', error)
        
        // DB 오류 시 안전한 기본값 반환
        return {
            preregistration_count: 0,
            comment_count: 0,
            writing_count: 0,
            total_participants: 0,
            active_campaigns: 0
        }
    }
}

// 폴백 데이터 (DB 완전 실패 시)
const getFallbackData = (): CampaignStatsData => ({
    preregistration_count: 0,
    comment_count: 0,
    writing_count: 0,
    total_participants: 0,
    active_campaigns: 0
})

export async function GET(request: NextRequest) {
    try {
        // 1. 먼저 캐시 확인
        const cachedData = getCachedData()
        if (cachedData) {
            return NextResponse.json({
                success: true,
                data: cachedData,
                timestamp: new Date().toISOString(),
                source: 'memory-cache',
                cache_hit: true
            }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
                    'X-Data-Source': 'memory-cache'
                }
            })
        }

        // 2. 캐시 미스 시 DB에서 조회
        const data = await getCampaignStatsFromDB()
        
        // 3. 새 데이터를 캐시에 저장
        setCacheData(data)
        
        // 4. 데이터 유효성 최종 검증
        const isValidData = 
            typeof data.preregistration_count === 'number' && data.preregistration_count >= 0 &&
            typeof data.comment_count === 'number' && data.comment_count >= 0 &&
            typeof data.writing_count === 'number' && data.writing_count >= 0

        if (!isValidData) {
            console.warn('⚠️ 잘못된 통계 데이터, 폴백 사용')
            const fallbackData = getFallbackData()
            setCacheData(fallbackData)
            
            return NextResponse.json({
                success: true,
                data: fallbackData,
                timestamp: new Date().toISOString(),
                source: 'fallback',
                cache_hit: false
            }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
                    'X-Data-Source': 'fallback'
                }
            })
        }

        return NextResponse.json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
            source: 'database-fresh',
            cache_hit: false
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
                'X-Data-Source': 'database-fresh'
            }
        })

    } catch (error) {
        console.error('❌ 캠페인 통계 API 오류:', error)

        const fallbackData = getFallbackData()
        setCacheData(fallbackData)
        
        return NextResponse.json({
            success: true,
            data: fallbackData,
            timestamp: new Date().toISOString(),
            source: 'fallback',
            error: 'Database temporarily unavailable',
            cache_hit: false
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
                'X-Data-Source': 'fallback-error'
            }
        })
    }
}

// 캐시 관리 엔드포인트
export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json()

        if (action === 'invalidate') {
            statsCache = null

            return NextResponse.json({
                success: true,
                message: '캐시가 무효화되었습니다. 다음 요청 시 새로운 데이터를 조회합니다.',
                timestamp: new Date().toISOString()
            })
        }

        if (action === 'status') {
            const cacheStatus = statsCache ? {
                exists: true,
                age_seconds: Math.round((Date.now() - statsCache.timestamp) / 1000),
                ttl_seconds: Math.round(statsCache.ttl / 1000),
                remaining_seconds: Math.round((statsCache.ttl - (Date.now() - statsCache.timestamp)) / 1000),
                is_valid: isCacheValid(statsCache),
                data_preview: statsCache.data
            } : {
                exists: false
            }

            return NextResponse.json({
                success: true,
                cache_status: cacheStatus,
                timestamp: new Date().toISOString()
            })
        }

        return NextResponse.json({
            success: false,
            error: '잘못된 액션입니다. 사용 가능한 액션: invalidate, status'
        }, { status: 400 })

    } catch (error) {
        console.error('❌ API 오류:', error)
        return NextResponse.json({
            success: false,
            error: '서버 내부 오류'
        }, { status: 500 })
    }
}