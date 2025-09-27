import { cache } from 'react'
import { query, queryOne } from '@/lib/mysql/connection'
import { NewsItem, NewsListParams } from '@/types/Board'
import { unstable_cache } from 'next/cache'

// 공지사항 목록 조회 (캐시됨)
export const getNewsList = cache(async (params: NewsListParams = {}) => {
  const { page = 1, limit = 10, category, search, important } = params
  const offset = (page - 1) * limit

  let whereClause = 'WHERE 1=1'
  const queryParams: any[] = []

  if (category) {
    whereClause += ' AND category = ?'
    queryParams.push(category)
  }

  if (search) {
    whereClause += ' AND (title LIKE ? OR content LIKE ?)'
    queryParams.push(`%${search}%`, `%${search}%`)
  }

  if (important !== undefined) {
    whereClause += ' AND important = ?'
    queryParams.push(important ? 1 : 0)
  }

  const [items, countResult] = await Promise.all([
    query(
      `SELECT * FROM news_items ${whereClause} 
       ORDER BY important DESC, date DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    ),
    query(
      `SELECT COUNT(*) as total FROM news_items ${whereClause}`,
      queryParams
    )
  ])

  return {
    items: items as NewsItem[],
    total: countResult[0].total,
    page,
    limit,
    totalPages: Math.ceil(countResult[0].total / limit)
  }
})

// 단일 공지사항 조회 (캐시됨)
export const getNewsItem = unstable_cache(
  async (id: string): Promise<NewsItem | null> => {
    const item = await queryOne('SELECT * FROM news_items WHERE id = ?', [id])
    return item || null
  },
  ['news-item'],
  {
    tags: ['news-list'],
    revalidate: 3600 // 1시간
  }
)

// 카테고리 목록 조회
export const getNewsCategories = cache(async () => {
  const categories = await query(
    'SELECT DISTINCT category FROM news_items ORDER BY category'
  )
  return categories.map((c: any) => c.category)
})