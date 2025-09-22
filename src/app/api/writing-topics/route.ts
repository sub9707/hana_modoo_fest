import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

export async function GET() {
  try {
    const topics = await query(`
      SELECT 
        id,
        title,
        description,
        deadline,
        examples,
        is_active,
        (SELECT COUNT(*) FROM writings WHERE topic = writing_topics.title) as participants
      FROM writing_topics 
      ORDER BY id ASC
    `)

    // JSON 파싱
    const formattedTopics = topics.map((topic: any) => ({
      ...topic,
      examples: typeof topic.examples === 'string' ? JSON.parse(topic.examples) : topic.examples
    }))

    return NextResponse.json({ 
      success: true, 
      data: formattedTopics 
    })
  } catch (error) {
    console.error('Error fetching writing topics:', error)
    return NextResponse.json(
      { success: false, error: '주제를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}