// hooks/useAdmin.ts
import { useState, useEffect, useCallback } from 'react'
import { Registration, Quiz, Comment, Writing, GalleryPhoto, Notice } from '@/types/admin'
import { User } from '@/types/auth'

// API 응답 타입
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 기본 API 훅
function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// 대시보드 통계 훅
export function useDashboardStats() {
  const { data, loading, error, refetch } = useApi<{
    totalVisitors: number
    pageViews: number
    registrations: number
    campaignParticipants: number
    recentRegistrations: Array<{ date: string; count: number }>
    topPages: Array<{ page: string; views: number; visitors: number }>
  }>('/api/admin/dashboard/stats')

  return {
    stats: data,
    loading,
    error,
    refetch
  }
}

// 사전접수 관리 훅
export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 사전접수 목록 조회
  const fetchRegistrations = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    program?: string
  }) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.program) queryParams.append('program', params.program)

      const response = await fetch(`/api/admin/registrations?${queryParams}`)
      const result: ApiResponse<PaginatedResponse<Registration>> = await response.json()
      
      if (result.success) {
        setRegistrations(result.data.items)
      } else {
        setError(result.error || '사전접수 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 엑셀 다운로드
  const exportToExcel = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/registrations/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = '사전접수목록.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('엑셀 다운로드 실패:', err)
    }
  }, [])

  return {
    registrations,
    loading,
    error,
    fetchRegistrations,
    exportToExcel
  }
}

// 퀴즈 관리 훅
export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 퀴즈 목록 조회
  const fetchQuizzes = useCallback(async (category?: string) => {
    try {
      setLoading(true)
      const url = category ? `/api/admin/quizzes?category=${category}` : '/api/admin/quizzes'
      const response = await fetch(url)
      const result: ApiResponse<Quiz[]> = await response.json()
      
      if (result.success) {
        setQuizzes(result.data)
      } else {
        setError(result.error || '퀴즈 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 퀴즈 생성
  const createQuiz = useCallback(async (quiz: Omit<Quiz, 'id'>) => {
    try {
      const response = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      })
      
      const result: ApiResponse<Quiz> = await response.json()
      
      if (result.success) {
        setQuizzes(prev => [result.data, ...prev])
        return result.data
      } else {
        throw new Error(result.error || '퀴즈 생성에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  // 퀴즈 수정
  const updateQuiz = useCallback(async (id: string, quiz: Partial<Quiz>) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      })
      
      const result: ApiResponse<Quiz> = await response.json()
      
      if (result.success) {
        setQuizzes(prev => prev.map(q => q.id === id ? result.data : q))
        return result.data
      } else {
        throw new Error(result.error || '퀴즈 수정에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  // 퀴즈 삭제
  const deleteQuiz = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setQuizzes(prev => prev.filter(q => q.id !== id))
      } else {
        throw new Error(result.error || '퀴즈 삭제에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
  }
}

// 댓글 관리 훅
export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async (isApproved?: boolean) => {
    try {
      setLoading(true)
      const url = isApproved !== undefined 
        ? `/api/admin/comments?isApproved=${isApproved}`
        : '/api/admin/comments'
      
      const response = await fetch(url)
      const result: ApiResponse<Comment[]> = await response.json()
      
      if (result.success) {
        setComments(result.data)
      } else {
        setError(result.error || '댓글 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 댓글 승인/거부
  const updateCommentApproval = useCallback(async (id: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setComments(prev => prev.map(comment => 
          comment.id === id ? { ...comment, isApproved } : comment
        ))
      } else {
        throw new Error(result.error || '댓글 승인 상태 변경에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  // 댓글 삭제
  const deleteComment = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== id))
      } else {
        throw new Error(result.error || '댓글 삭제에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  return {
    comments,
    loading,
    error,
    fetchComments,
    updateCommentApproval,
    deleteComment
  }
}

// 갤러리 관리 훅
export function useGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = useCallback(async (category?: string) => {
    try {
      setLoading(true)
      const url = category ? `/api/admin/gallery?category=${category}` : '/api/admin/gallery'
      const response = await fetch(url)
      const result: ApiResponse<GalleryPhoto[]> = await response.json()
      
      if (result.success) {
        setPhotos(result.data)
      } else {
        setError(result.error || '갤러리를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Blur 상태 토글
  const toggleBlur = useCallback(async (id: string, isBlurred: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}/blur`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlurred }),
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setPhotos(prev => prev.map(photo => 
          photo.id === id ? { ...photo, isBlurred } : photo
        ))
      } else {
        throw new Error(result.error || 'Blur 상태 변경에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  // 사진 삭제
  const deletePhoto = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setPhotos(prev => prev.filter(photo => photo.id !== id))
      } else {
        throw new Error(result.error || '사진 삭제에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    toggleBlur,
    deletePhoto
  }
}

// 회원 관리 훅
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (params?: {
    status?: string
    search?: string
    dateFilter?: string
  }) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (params?.status) queryParams.append('status', params.status)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.dateFilter) queryParams.append('dateFilter', params.dateFilter)

      const response = await fetch(`/api/admin/users?${queryParams}`)
      const result: ApiResponse<{ users: User[]; total: number }> = await response.json()
      
      if (result.success) {
        setUsers(result.data.users)
      } else {
        setError(result.error || '사용자 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 사용자 상태 변경
  const updateUserStatus = useCallback(async (id: string, status: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, status } : user
        ))
      } else {
        throw new Error(result.error || '사용자 상태 변경에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus
  }
}

// 공지사항 관리 훅
export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotices = useCallback(async (category?: string) => {
    try {
      setLoading(true)
      const url = category ? `/api/admin/notices?category=${category}` : '/api/admin/notices'
      const response = await fetch(url)
      const result: ApiResponse<Notice[]> = await response.json()
      
      if (result.success) {
        setNotices(result.data)
      } else {
        setError(result.error || '공지사항 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const createNotice = useCallback(async (notice: Omit<Notice, 'id' | 'views' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      })
      
      const result: ApiResponse<Notice> = await response.json()
      
      if (result.success) {
        setNotices(prev => [result.data, ...prev])
        return result.data
      } else {
        throw new Error(result.error || '공지사항 생성에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  const updateNotice = useCallback(async (id: string, notice: Partial<Notice>) => {
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      })
      
      const result: ApiResponse<Notice> = await response.json()
      
      if (result.success) {
        setNotices(prev => prev.map(n => n.id === id ? result.data : n))
        return result.data
      } else {
        throw new Error(result.error || '공지사항 수정에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  const deleteNotice = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (result.success) {
        setNotices(prev => prev.filter(n => n.id !== id))
      } else {
        throw new Error(result.error || '공지사항 삭제에 실패했습니다.')
      }
    } catch (err) {
      throw err
    }
  }, [])

  return {
    notices,
    loading,
    error,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice
  }
}

// 실시간 알림 훅
export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'registration' | 'comment' | 'writing' | 'error'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>>([])

  useEffect(() => {
    // WebSocket 연결 또는 Server-Sent Events 설정
    // 실제 구현에서는 WebSocket이나 SSE를 사용하여 실시간 알림 구현
    const eventSource = new EventSource('/api/admin/notifications/stream')
    
    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev.slice(0, 49)]) // 최대 50개 유지
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    clearAll
  }
}