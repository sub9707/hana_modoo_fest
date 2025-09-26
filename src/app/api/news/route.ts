import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/lib/services/news-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as any) || 'newest',
      limit: parseInt(searchParams.get('limit') || '10'),
      cursor: searchParams.get('cursor') || undefined
    }

    const result = await NewsService.getNewsList(params)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}