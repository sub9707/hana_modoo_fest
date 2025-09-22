// app/api/writings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'latest' // latest, popular, oldest
    const topic = searchParams.get('topic') || 'all'
    
    const offset = (page - 1) * limit

    // 정렬 조건 설정
    let orderBy = 'w.created_at DESC'
    switch (sort) {
      case 'popular':
        orderBy = 'w.likes_count DESC, w.created_at DESC'
        break
      case 'oldest':
        orderBy = 'w.created_at ASC'
        break
      default:
        orderBy = 'w.created_at DESC'
    }

    // 주제 필터 조건
    let topicCondition = ''
    const params: any[] = []
    
    if (topic !== 'all') {
      topicCondition = 'WHERE w.topic = ?'
      params.push(topic)
    }

    // 현재 사용자 확인 (좋아요 상태 체크용)
    const currentUser = await getCurrentUser()
    
    const likesJoin = currentUser 
      ? `LEFT JOIN writing_likes wl ON w.id = wl.writing_id AND wl.user_id = '${currentUser.id}'`
      : ''
    
    const likesSelect = currentUser 
      ? ', CASE WHEN wl.id IS NOT NULL THEN true ELSE false END as is_liked'
      : ', false as is_liked'

    // 글 목록 조회
    const writings = await query(`
      SELECT 
        w.id,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        w.is_featured,
        w.created_at,
        u.name as author_name
        ${likesSelect}
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${likesJoin}
      ${topicCondition}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    // 총 개수 조회
    const totalCountResult = await query(`
      SELECT COUNT(*) as total
      FROM writings w
      ${topicCondition}
    `, params)

    const totalCount = totalCountResult[0]?.total || 0
    const hasMore = (page * limit) < totalCount

    return NextResponse.json({
      success: true,
      data: {
        writings,
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
            cooldownRemaining: remainingSeconds
          },
          { status: 429 }
        )
      }
    }

    // 글 작성
    await query(`
      INSERT INTO writings (user_id, topic, title, content)
      VALUES (?, ?, ?, ?)
    `, [user.id, topic, title.trim(), content.trim()])

    return NextResponse.json({
      success: true,
      message: '글이 성공적으로 작성되었습니다.'
    })
  } catch (error) {
    console.error('Error creating writing:', error)
    return NextResponse.json(
      { success: false, error: '글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}