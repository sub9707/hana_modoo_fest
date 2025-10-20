'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { query, queryOne } from '@/lib/mysql/connection'
import { requireRole } from '@/lib/mysql/server'
import { NewsFormData } from '@/types/Board'

// 공지사항 생성
export async function createNewsItem(formData: FormData) {
  try {
    await requireRole('editor')

    const data: NewsFormData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string || null,
      content: formData.get('content') as string,
      content_type: formData.get('content_type') as 'text' | 'html' | 'markdown',
      important: formData.get('important') === 'true'
    }

    // 유효성 검사
    if (!data.title || !data.category || !data.content) {
      return { error: '제목, 카테고리, 내용은 필수입니다.' }
    }

    const id = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await query(
      `INSERT INTO news_items (id, title, category, date, summary, content, content_type, important, views)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 0)`,
      [id, data.title, data.category, data.summary, data.content, data.content_type, data.important ? 1 : 0]
    )

    revalidateTag('news-list')
    revalidatePath('/admin/news')
    
    return { success: true, id }
  } catch (error) {
    console.error('Error creating news item:', error)
    return { error: '공지사항 생성 중 오류가 발생했습니다.' }
  }
}

// 공지사항 수정
export async function updateNewsItem(id: string, formData: FormData) {
  try {
    await requireRole('editor')

    const data: NewsFormData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string || null,
      content: formData.get('content') as string,
      content_type: formData.get('content_type') as 'text' | 'html' | 'markdown',
      important: formData.get('important') === 'true'
    }

    if (!data.title || !data.category || !data.content) {
      return { error: '제목, 카테고리, 내용은 필수입니다.' }
    }

    const result = await query(
      `UPDATE news_items 
       SET title = ?, category = ?, summary = ?, content = ?, content_type = ?, important = ?
       WHERE id = ?`,
      [data.title, data.category, data.summary, data.content, data.content_type, data.important ? 1 : 0, id]
    )

    if (result.affectedRows === 0) {
      return { error: '공지사항을 찾을 수 없습니다.' }
    }

    revalidateTag('news-list')
    revalidateTag(`news-${id}`)
    revalidatePath('/admin/news')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating news item:', error)
    return { error: '공지사항 수정 중 오류가 발생했습니다.' }
  }
}

// 공지사항 삭제
export async function deleteNewsItem(id: string) {
  try {
    await requireRole('editor')

    const result = await query('DELETE FROM news_items WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return { error: '공지사항을 찾을 수 없습니다.' }
    }

    revalidateTag('news-list')
    revalidatePath('/admin/news')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting news item:', error)
    return { error: '공지사항 삭제 중 오류가 발생했습니다.' }
  }
}

// 조회수 증가
export async function incrementViews(id: string) {
  try {
    await query('UPDATE news_items SET views = views + 1 WHERE id = ?', [id])
    revalidateTag(`news-${id}`)
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}