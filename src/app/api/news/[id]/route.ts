import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/lib/news-service'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params 
    const news = await NewsService.getNewsById(id)

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news detail:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news detail' },
      { status: 500 }
    )
  }
}
