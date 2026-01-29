import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Registration, Quiz, Comment, GalleryPhoto, Notice } from '@/types/admin'
import { User } from '@/types/auth'
import { ApiResponse } from '@/types/common'
import { useAbortController } from './utils'

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function useApi<T>(url: string, initialOptions?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()

  const memoizedOptions = useMemo(() => ({
    ...initialOptions,
    headers: {
      'Content-Type': 'application/json',
      ...initialOptions?.headers,
    },
  }), [initialOptions])

  const fetchData = useCallback(async () => {
    const controller = getController()

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        ...memoizedOptions,
        signal: controller.signal
      })

      if (controller.signal.aborted) return

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      if (controller.signal.aborted) return

      if (result.success) {
        setData(result.data ?? null)
      } else {
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return

      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [url, memoizedOptions, getController])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

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

// 🚀 사전접수 관리 훅 (완전 최적화)
export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  
  // 🚀 API 호출 중복 방지
  const loadingRef = useRef(false)

  // 🚀 사전접수 목록 조회 (메모이제이션 최적화)
  const fetchRegistrations = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    program?: string
  }) => {
    // 🚀 중복 호출 방지
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.program) queryParams.append('program', params.program)

      const response = await fetch(`/api/admin/registrations?${queryParams}`, {
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<PaginatedResponse<Registration>> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setRegistrations(result.data?.items ?? [])
      } else {
        setError(result.error || '사전접수 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  // 🚀 엑셀 다운로드 (메모리 누수 방지)
  const exportToExcel = useCallback(async () => {
    const controller = getController()
    
    try {
      const response = await fetch('/api/admin/registrations/export', {
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      if (response.ok) {
        const blob = await response.blob()
        if (controller.signal.aborted) return
        
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
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('엑셀 다운로드 실패:', err)
    }
  }, [getController])

  return {
    registrations,
    loading,
    error,
    fetchRegistrations,
    exportToExcel
  }
}

// 🚀 퀴즈 관리 훅 (완전 최적화)
export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  const loadingRef = useRef(false)

  // 🚀 퀴즈 목록 조회 (중복 방지)
  const fetchQuizzes = useCallback(async (category?: string) => {
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const url = category ? `/api/admin/quizzes?category=${category}` : '/api/admin/quizzes'
      const response = await fetch(url, { signal: controller.signal })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<Quiz[]> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setQuizzes(result.data ?? [])
      } else {
        setError(result.error || '퀴즈 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  // 🚀 퀴즈 생성 (상태 업데이트 최적화)
  const createQuiz = useCallback(async (quiz: Omit<Quiz, 'id'>) => {
    const controller = getController()
    
    try {
      const response = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return null
      
      const result: ApiResponse<Quiz> = await response.json()
      
      if (controller.signal.aborted) return null

      if (result.success && result.data) {
        setQuizzes(prev => [result.data!, ...prev])
        return result.data
      } else {
        throw new Error(result.error || '퀴즈 생성에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null
      throw err
    }
  }, [getController])

  // 🚀 퀴즈 수정 (메모리 효율적 상태 업데이트)
  const updateQuiz = useCallback(async (id: string, quiz: Partial<Quiz>) => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return null
      
      const result: ApiResponse<Quiz> = await response.json()
      
      if (controller.signal.aborted) return null

      if (result.success && result.data) {
        setQuizzes(prev => prev.map(q => q.id === id ? result.data! : q))
        return result.data
      } else {
        throw new Error(result.error || '퀴즈 수정에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null
      throw err
    }
  }, [getController])

  // 🚀 퀴즈 삭제 (메모리 효율적)
  const deleteQuiz = useCallback(async (id: string) => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<void> = await response.json()
      
      if (controller.signal.aborted) return
      
      if (result.success) {
        setQuizzes(prev => prev.filter(q => q.id !== id))
      } else {
        throw new Error(result.error || '퀴즈 삭제에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      throw err
    }
  }, [getController])

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

// 🚀 사용자 관리 훅 (최적화)
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  const loadingRef = useRef(false)

  // 🚀 사용자 목록 조회
  const fetchUsers = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/users', {
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<User[]> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setUsers(result.data ?? [])
      } else {
        setError(result.error || '사용자 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  // 🚀 사용자 상태 변경
  const updateUserStatus = useCallback(async (id: string, status: 'active' | 'inactive') => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<void> = await response.json()
      
      if (controller.signal.aborted) return
      
      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, status } : user
        ))
      } else {
        throw new Error(result.error || '사용자 상태 변경에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      throw err
    }
  }, [getController])

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserStatus
  }
}

// 🚀 댓글 관리 훅 (최적화) 
export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  const loadingRef = useRef(false)

  const fetchComments = useCallback(async (isApproved?: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const url = isApproved !== undefined 
        ? `/api/admin/comments?isApproved=${isApproved}`
        : '/api/admin/comments'
      
      const response = await fetch(url, { signal: controller.signal })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<Comment[]> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setComments(result.data ?? [])
      } else {
        setError(result.error || '댓글 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  // 🚀 댓글 승인/거부
  const updateCommentApproval = useCallback(async (id: string, isApproved: boolean) => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/comments/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<void> = await response.json()
      
      if (controller.signal.aborted) return
      
      if (result.success) {
        setComments(prev => prev.map(comment => 
          comment.id === id ? { ...comment, isApproved } : comment
        ))
      } else {
        throw new Error(result.error || '댓글 승인 상태 변경에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      throw err
    }
  }, [getController])

  // 🚀 댓글 삭제
  const deleteComment = useCallback(async (id: string) => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<void> = await response.json()
      
      if (controller.signal.aborted) return
      
      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== id))
      } else {
        throw new Error(result.error || '댓글 삭제에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      throw err
    }
  }, [getController])

  return {
    comments,
    loading,
    error,
    fetchComments,
    updateCommentApproval,
    deleteComment
  }
}

// 🚀 갤러리 관리 훅 (최적화)
export function useGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  const loadingRef = useRef(false)

  const fetchPhotos = useCallback(async (category?: string) => {
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const url = category ? `/api/admin/gallery?category=${category}` : '/api/admin/gallery'
      const response = await fetch(url, { signal: controller.signal })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<GalleryPhoto[]> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setPhotos(result.data ?? [])
      } else {
        setError(result.error || '갤러리를 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  return {
    photos,
    loading,
    error,
    fetchPhotos
  }
}

// 🚀 공지사항 관리 훅 (완전 최적화)
export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getController } = useAbortController()
  const loadingRef = useRef(false)

  const fetchNotices = useCallback(async (category?: string) => {
    if (loadingRef.current) return
    loadingRef.current = true

    const controller = getController()
    
    try {
      setLoading(true)
      setError(null)
      
      const url = category ? `/api/admin/notices?category=${category}` : '/api/admin/notices'
      const response = await fetch(url, { signal: controller.signal })
      
      if (controller.signal.aborted) return
      
      const result: ApiResponse<Notice[]> = await response.json()
      
      if (controller.signal.aborted) return

      if (result.success) {
        setNotices(result.data ?? [])
      } else {
        setError(result.error || '공지사항 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [getController])

  const createNotice = useCallback(async (notice: Omit<Notice, 'id' | 'views' | 'createdAt'>) => {
    const controller = getController()
    
    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return null
      
      const result: ApiResponse<Notice> = await response.json()
      
      if (controller.signal.aborted) return null

      if (result.success && result.data) {
        setNotices(prev => [result.data!, ...prev])
        return result.data
      } else {
        throw new Error(result.error || '공지사항 생성에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null
      throw err
    }
  }, [getController])

  const updateNotice = useCallback(async (id: string, notice: Partial<Notice>) => {
    const controller = getController()
    
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
        signal: controller.signal
      })
      
      if (controller.signal.aborted) return null
      
      const result: ApiResponse<Notice> = await response.json()
      
      if (controller.signal.aborted) return null

      if (result.success && result.data) {
        setNotices(prev => prev.map(n => n.id === id ? result.data! : n))
        return result.data
      } else {
        throw new Error(result.error || '공지사항 수정에 실패했습니다.')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null
      throw err
    }
  }, [getController])

  return {
    notices,
    loading,
    error,
    fetchNotices,
    createNotice,
    updateNotice
  }
}