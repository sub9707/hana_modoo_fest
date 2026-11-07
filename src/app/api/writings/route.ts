import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'latest'
    const topic = searchParams.get('topic') || 'all'
    
    const currentUser = await getCurrentUser()
    const offset = (page - 1) * limit

    // 우수작품 ID 목록 먼저 조회
    const featuredIdsQuery = `
      SELECT id
      FROM (
        SELECT 
          id,
          ROW_NUMBER() OVER (PARTITION BY topic ORDER BY likes_count DESC, created_at DESC) as rn
        FROM writings
        WHERE likes_count >= 1
      ) ranked
      WHERE rn <= 10
    `
    
    const featuredIdsResult = await query(featuredIdsQuery)
    const featuredIds = featuredIdsResult.map((row: any) => row.id)

    // is_liked 서브쿼리
    let isLikedSelect = '0 as is_liked'
    const userParams: any[] = []
    
    if (currentUser) {
      isLikedSelect = `IF(
        (SELECT COUNT(*) FROM writing_likes WHERE writing_id = w.id AND user_id = ?) > 0,
        1,
        0
      ) as is_liked`
      userParams.push(currentUser.id)
    }

    // 정렬 조건
    let orderBy = 'w.created_at DESC' // 기본값: 최신순
    
    switch (sort) {
      case 'popular':
      case 'likes':
        orderBy = 'w.likes_count DESC, w.created_at DESC, w.id DESC'
        break
      case 'oldest':
        orderBy = 'w.created_at ASC, w.id ASC'
        break
      case 'latest':
      default:
        orderBy = 'w.created_at DESC, w.id DESC'
        break
    }

    // 주제 필터
    let topicCondition = 'WHERE 1=1'
    const topicParams: any[] = []
    
    if (topic !== 'all') {
      topicCondition = 'WHERE w.topic = ?'
      topicParams.push(topic)
    }

    // 작품 목록 조회
    const writingsQuery = `
      SELECT 
        w.id,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        w.created_at,
        u.name as author_name,
        ${isLikedSelect}
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${topicCondition}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `

    const queryParams = [...userParams, ...topicParams, limit, offset]
    const writings = await query(writingsQuery, queryParams)

    // 우수작품 여부 판정
    const processedWritings = writings.map((writing: any) => ({
      ...writing,
      is_featured: featuredIds.includes(writing.id),
      is_liked: Number(writing.is_liked) === 1
    }))

    // 총 개수 조회
    const totalCountResult = await query(`
      SELECT COUNT(*) as total
      FROM writings w
      ${topicCondition}
    `, topicParams)

    const totalCount = totalCountResult[0]?.total || 0
    const hasMore = (page * limit) < totalCount

    return NextResponse.json({
      success: true,
      data: {
        writings: processedWritings,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching writings:', error)
    return NextResponse.json(
      { success: false, error: '글 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { topic, title, content } = await request.json()

    // 입력값 검증
    if (!topic || !title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (title.length > 100) {
      return NextResponse.json(
        { success: false, error: '제목은 100자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    if (content.length > 1500) {
      return NextResponse.json(
        { success: false, error: '내용은 1500자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    // 쿨타임 체크 (5분)
    const lastWriting = await query(`
      SELECT created_at 
      FROM writings 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [user.id])

    if (lastWriting.length > 0) {
      const lastWritingTime = new Date(lastWriting[0].created_at)
      const now = new Date()
      const timeDiff = now.getTime() - lastWritingTime.getTime()
      const cooldownMs = 5 * 60 * 1000 // 5분

      if (timeDiff < cooldownMs) {
        const remainingMs = cooldownMs - timeDiff
        const remainingSeconds = Math.ceil(remainingMs / 1000)
        
        return NextResponse.json(
          { 
            success: false, 
            error: '글 작성 후 5분 후에 다시 작성할 수 있습니다.',
            remainingSeconds
          },
          { status: 429 }
        )
      }
    }

    // 글 작성
    const result = await query(`
      INSERT INTO writings (user_id, topic, title, content)
      VALUES (?, ?, ?, ?)
    `, [user.id, topic, title, content])

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        message: '글이 성공적으로 작성되었습니다.'
      }
    })

  } catch (error) {
    console.error('Error creating writing:', error)
    return NextResponse.json(
      { success: false, error: '글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}