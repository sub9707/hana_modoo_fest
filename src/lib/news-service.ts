// lib/news-service.ts - 업데이트된 뉴스 서비스
import { query, queryOne, transaction } from './mysql/connection'
import { NewsItem, NewsListResponse, NewsSearchParams, NewsAttachment, NewsEditorImage } from '@/types/Board'

export class NewsService {
  /**
   * 뉴스 목록 조회
   */
  static async getNewsList(params: NewsSearchParams): Promise<NewsListResponse> {
    const {
      category,
      search,
      sort = 'newest',
      limit = 10,
      cursor
    } = params

    try {
      // 메인 쿼리 구성
      let sql = `
        SELECT 
          n.*,
          COUNT(DISTINCT a.id) as attachment_count,
          COUNT(DISTINCT ei.id) as image_count
        FROM news_items n
        LEFT JOIN news_attachments a ON n.id = a.news_id
        LEFT JOIN news_editor_images ei ON n.id = ei.news_id
      `
      
      const conditions: string[] = []
      const queryParams: any[] = []

      // 카테고리 필터
      if (category && category !== 'all') {
        conditions.push('n.category = ?')
        queryParams.push(category)
      }

      // 검색 조건
      if (search) {
        conditions.push('(n.title LIKE ? OR n.summary LIKE ? OR n.content LIKE ?)')
        const searchTerm = `%${search}%`
        queryParams.push(searchTerm, searchTerm, searchTerm)
      }

      // 커서 기반 페이징 (created_at 기준)
      if (cursor) {
        conditions.push('n.created_at < ?')
        queryParams.push(cursor)
      }

      // WHERE 절 추가
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ')
      }

      // GROUP BY 추가
      sql += ' GROUP BY n.id'

      // 정렬 조건
      switch (sort) {
        case 'oldest':
          sql += ' ORDER BY n.created_at ASC'
          break
        case 'views':
          sql += ' ORDER BY n.views DESC, n.created_at DESC'
          break
        case 'important':
          sql += ' ORDER BY n.important DESC, n.created_at DESC'
          break
        default: // newest
          sql += ' ORDER BY n.created_at DESC'
      }

      // 제한 조건 (hasMore 체크를 위해 +1)
      sql += ' LIMIT ?'
      queryParams.push(limit + 1)

      // 뉴스 목록 조회
      const newsItems = await query(sql, queryParams)

      // hasMore 체크 및 실제 결과 추출
      const hasMore = newsItems.length > limit
      const news = hasMore ? newsItems.slice(0, limit) : newsItems
      const nextCursor = hasMore && news.length > 0 ? news[news.length - 1].created_at : undefined

      // 총 개수 조회 (첫 페이지에서만)
      let totalCount = 0
      if (!cursor) {
        let countSql = 'SELECT COUNT(DISTINCT n.id) as count FROM news_items n'
        const countConditions: string[] = []
        const countParams: any[] = []

        if (category && category !== 'all') {
          countConditions.push('n.category = ?')
          countParams.push(category)
        }

        if (search) {
          countConditions.push('(n.title LIKE ? OR n.summary LIKE ? OR n.content LIKE ?)')
          const searchTerm = `%${search}%`
          countParams.push(searchTerm, searchTerm, searchTerm)
        }

        if (countConditions.length > 0) {
          countSql += ' WHERE ' + countConditions.join(' AND ')
        }

        const countResult = await queryOne(countSql, countParams)
        totalCount = countResult?.count || 0
      }

      // 응답 데이터 포맷팅
      const formattedNews: NewsItem[] = news.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date, // dateStrings: true이므로 이미 문자열
        summary: item.summary,
        content: item.content,
        contentType: item.content_type,
        views: item.views,
        important: Boolean(item.important),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        attachmentCount: item.attachment_count,
        imageCount: item.image_count
      }))

      return {
        news: formattedNews,
        totalCount,
        hasMore,
        nextCursor
      }
    } catch (error) {
      console.error('Error fetching news list:', error)
      throw new Error('뉴스 목록을 불러오는데 실패했습니다.')
    }
  }

  /**
   * 뉴스 상세 조회 (조회수 증가 포함)
   */
  static async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      return await transaction(async (connection) => {
        // 뉴스 기본 정보 조회
        const newsSql = `
          SELECT * FROM news_items 
          WHERE id = ?
        `
        
        const [newsRows] = await connection.execute(newsSql, [id])
        const newsData = newsRows as any[]
        
        if (!newsData || newsData.length === 0) {
          return null
        }

        const newsItem = newsData[0]

        // 첨부파일 조회
        const attachmentsSql = `
          SELECT * FROM news_attachments 
          WHERE news_id = ? 
          ORDER BY display_order ASC
        `
        const [attachmentRows] = await connection.execute(attachmentsSql, [id])
        const attachments = (attachmentRows as any[]).map((attachment: any) => ({
          id: attachment.id,
          newsId: attachment.news_id,
          originalFilename: attachment.original_filename,
          storedFilename: attachment.stored_filename,
          filePath: attachment.file_path,
          fileSize: attachment.file_size,
          mimeType: attachment.mime_type,
          fileExtension: attachment.file_extension,
          displayOrder: attachment.display_order,
          createdAt: attachment.created_at
        }))

        // 에디터 이미지 조회
        const imagesSql = `
          SELECT * FROM news_editor_images 
          WHERE news_id = ? 
          ORDER BY created_at ASC
        `
        const [imageRows] = await connection.execute(imagesSql, [id])
        const editorImages = (imageRows as any[]).map((image: any) => ({
          id: image.id,
          newsId: image.news_id,
          originalFilename: image.original_filename,
          storedFilename: image.stored_filename,
          filePath: image.file_path,
          fileSize: image.file_size,
          width: image.width,
          height: image.height,
          altText: image.alt_text,
          createdAt: image.created_at
        }))

        // 조회수 증가
        const updateViewsSql = `
          UPDATE news_items 
          SET views = views + 1, updated_at = NOW() 
          WHERE id = ?
        `
        await connection.execute(updateViewsSql, [id])

        // 결과 반환
        return {
          id: newsItem.id,
          title: newsItem.title,
          category: newsItem.category,
          date: newsItem.date,
          summary: newsItem.summary,
          content: newsItem.content,
          contentType: newsItem.content_type,
          views: newsItem.views + 1, // 증가된 조회수 반영
          important: Boolean(newsItem.important),
          createdAt: newsItem.created_at,
          updatedAt: newsItem.updated_at,
          attachments,
          editorImages
        }
      })
    } catch (error) {
      console.error('Error fetching news detail:', error)
      throw new Error('뉴스 상세 정보를 불러오는데 실패했습니다.')
    }
  }

  /**
   * 카테고리 목록 및 개수 조회
   */
  static async getCategories() {
    try {
      const sql = `
        SELECT 
          category,
          COUNT(*) as count
        FROM news_items 
        GROUP BY category
        ORDER BY count DESC
      `

      const categories = await query(sql)
      const totalCount = categories.reduce((sum: number, cat: any) => sum + cat.count, 0)

      return [
        { id: 'all', name: '전체', count: totalCount },
        ...categories.map((cat: any) => ({
          id: cat.category,
          name: cat.category,
          count: cat.count
        }))
      ]
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('카테고리 목록을 불러오는데 실패했습니다.')
    }
  }

  /**
   * 뉴스 생성
   */
  static async createNews(newsData: Partial<NewsItem>): Promise<string> {
    try {
      return await transaction(async (connection) => {
        const newsId = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const sql = `
          INSERT INTO news_items (
            id, title, category, date, summary, content, content_type, 
            views, important, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `

        const params = [
          newsId,
          newsData.title,
          newsData.category,
          newsData.date,
          newsData.summary,
          newsData.content,
          newsData.contentType || 'html',
          0, // 초기 조회수
          newsData.important ? 1 : 0
        ]

        await connection.execute(sql, params)
        return newsId
      })
    } catch (error) {
      console.error('Error creating news:', error)
      throw new Error('뉴스 생성에 실패했습니다.')
    }
  }

  /**
   * 뉴스 수정
   */
  static async updateNews(id: string, newsData: Partial<NewsItem>): Promise<boolean> {
    try {
      return await transaction(async (connection) => {
        const sql = `
          UPDATE news_items 
          SET title = ?, category = ?, date = ?, summary = ?, 
              content = ?, content_type = ?, important = ?, updated_at = NOW()
          WHERE id = ?
        `

        const params = [
          newsData.title,
          newsData.category,
          newsData.date,
          newsData.summary,
          newsData.content,
          newsData.contentType || 'html',
          newsData.important ? 1 : 0,
          id
        ]

        const [result] = await connection.execute(sql, params)
        return (result as any).affectedRows > 0
      })
    } catch (error) {
      console.error('Error updating news:', error)
      throw new Error('뉴스 수정에 실패했습니다.')
    }
  }

  /**
   * 뉴스 삭제
   */
  static async deleteNews(id: string): Promise<boolean> {
    try {
      return await transaction(async (connection) => {
        // 외래키 제약조건으로 자동 삭제되지만, 명시적으로 처리
        await connection.execute('DELETE FROM news_editor_images WHERE news_id = ?', [id])
        await connection.execute('DELETE FROM news_attachments WHERE news_id = ?', [id])
        
        const [result] = await connection.execute('DELETE FROM news_items WHERE id = ?', [id])
        return (result as any).affectedRows > 0
      })
    } catch (error) {
      console.error('Error deleting news:', error)
      throw new Error('뉴스 삭제에 실패했습니다.')
    }
  }

  /**
   * 첨부파일 추가
   */
  static async addAttachment(attachment: Omit<NewsAttachment, 'id' | 'createdAt'>): Promise<string> {
    try {
      const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const sql = `
        INSERT INTO news_attachments (
          id, news_id, original_filename, stored_filename, file_path,
          file_size, mime_type, file_extension, display_order, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `

      const params = [
        attachmentId,
        attachment.newsId,
        attachment.originalFilename,
        attachment.storedFilename,
        attachment.filePath,
        attachment.fileSize,
        attachment.mimeType,
        attachment.fileExtension,
        attachment.displayOrder
      ]

      await query(sql, params)
      return attachmentId
    } catch (error) {
      console.error('Error adding attachment:', error)
      throw new Error('첨부파일 추가에 실패했습니다.')
    }
  }

  /**
   * 에디터 이미지 추가
   */
  static async addEditorImage(image: Omit<NewsEditorImage, 'id' | 'createdAt'>): Promise<string> {
    try {
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const sql = `
        INSERT INTO news_editor_images (
          id, news_id, original_filename, stored_filename, file_path,
          file_size, width, height, alt_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `

      const params = [
        imageId,
        image.newsId,
        image.originalFilename,
        image.storedFilename,
        image.filePath,
        image.fileSize,
        image.width,
        image.height,
        image.altText
      ]

      await query(sql, params)
      return imageId
    } catch (error) {
      console.error('Error adding editor image:', error)
      throw new Error('에디터 이미지 추가에 실패했습니다.')
    }
  }

  /**
   * 인기 뉴스 조회 (조회수 기준)
   */
  static async getPopularNews(limit: number = 5): Promise<NewsItem[]> {
    try {
      const sql = `
        SELECT * FROM news_items 
        ORDER BY views DESC, created_at DESC 
        LIMIT ?
      `

      const rows = await query(sql, [limit])
      
      return rows.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        summary: item.summary,
        content: item.content,
        contentType: item.content_type,
        views: item.views,
        important: Boolean(item.important),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))
    } catch (error) {
      console.error('Error fetching popular news:', error)
      throw new Error('인기 뉴스를 불러오는데 실패했습니다.')
    }
  }

  /**
   * 최근 뉴스 조회
   */
  static async getRecentNews(limit: number = 5): Promise<NewsItem[]> {
    try {
      const sql = `
        SELECT * FROM news_items 
        ORDER BY created_at DESC 
        LIMIT ?
      `

      const rows = await query(sql, [limit])
      
      return rows.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        summary: item.summary,
        content: item.content,
        contentType: item.content_type,
        views: item.views,
        important: Boolean(item.important),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))
    } catch (error) {
      console.error('Error fetching recent news:', error)
      throw new Error('최근 뉴스를 불러오는데 실패했습니다.')
    }
  }

  /**
   * 뉴스 통계 조회
   */
  static async getNewsStatistics() {
    try {
      const stats = await Promise.all([
        // 총 뉴스 개수
        queryOne('SELECT COUNT(*) as total FROM news_items'),
        // 오늘 등록된 뉴스
        queryOne('SELECT COUNT(*) as today FROM news_items WHERE DATE(created_at) = CURDATE()'),
        // 총 조회수
        queryOne('SELECT SUM(views) as totalViews FROM news_items'),
        // 카테고리별 통계
        query('SELECT category, COUNT(*) as count FROM news_items GROUP BY category ORDER BY count DESC')
      ])

      return {
        totalNews: stats[0]?.total || 0,
        todayNews: stats[1]?.today || 0,
        totalViews: stats[2]?.totalViews || 0,
        categoryStats: stats[3] || []
      }
    } catch (error) {
      console.error('Error fetching news statistics:', error)
      throw new Error('뉴스 통계를 불러오는데 실패했습니다.')
    }
  }
}