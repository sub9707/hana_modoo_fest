import { useState, useCallback, useEffect, useRef } from 'react'
import { WritingEntry, User, SortType, TabType } from '@/types/writing'

export function useWritingData(currentUser: User | null, currentTab: TabType) {
  const [browseWritings, setBrowseWritings] = useState<WritingEntry[]>([])
  const [featuredWritings, setFeaturedWritings] = useState<WritingEntry[]>([])
  const [myWritings, setMyWritings] = useState<WritingEntry[]>([])
  const [browseSort, setBrowseSort] = useState<SortType>('latest')
  const [browseTopic, setBrowseTopic] = useState('all')
  const [featuredTopic, setFeaturedTopic] = useState('all')
  const [browseHasMore, setBrowseHasMore] = useState(true)
  const [myHasMore, setMyHasMore] = useState(true)
  const [browsePage, setBrowsePage] = useState(1)
  const [myPage, setMyPage] = useState(1)
  const [totalWritings, setTotalWritings] = useState(0)
  const [loading, setLoading] = useState(false)
  const [likingWritings, setLikingWritings] = useState<Set<string>>(new Set())

  // 로딩 중복 방지를 위한 ref
  const isLoadingRef = useRef(false)

  // API 호출 함수들
  const loadBrowseWritings = useCallback(async (reset = false) => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setLoading(true)

    try {
      const page = reset ? 1 : browsePage
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: browseSort,
        topic: browseTopic
      })

      const response = await fetch(`/api/writings?${params}`)
      const data = await response.json()

      if (data.success) {
        
        if (reset) {
          setBrowseWritings(data.data.writings)
          setBrowsePage(2)
        } else {
          setBrowseWritings(prev => [...prev, ...data.data.writings])
          setBrowsePage(prev => prev + 1)
        }
        setBrowseHasMore(data.data.pagination.hasMore)
        setTotalWritings(data.data.pagination.totalCount)
      }
    } catch (error) {
      console.error('Error loading browse writings:', error)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [browsePage, browseSort, browseTopic])

  const loadFeaturedWritings = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    try {
      const params = new URLSearchParams({
        topic: featuredTopic
      })

      const response = await fetch(`/api/writings/featured?${params}`)
      const data = await response.json()

      if (data.success) {
        setFeaturedWritings(data.data.writings)
      }
    } catch (error) {
      console.error('Error loading featured writings:', error)
    } finally {
      isLoadingRef.current = false
    }
  }, [featuredTopic])

  const loadMyWritings = useCallback(async (reset = false) => {
    if (isLoadingRef.current || !currentUser) return
    isLoadingRef.current = true
    setLoading(true)

    try {
      const page = reset ? 1 : myPage
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      const response = await fetch(`/api/writings/my?${params}`)
      const data = await response.json()

      if (data.success) {
        if (reset) {
          setMyWritings(data.data.writings)
          setMyPage(2)
        } else {
          setMyWritings(prev => [...prev, ...data.data.writings])
          setMyPage(prev => prev + 1)
        }
        setMyHasMore(data.data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error loading my writings:', error)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [currentUser, myPage])

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (currentTab === 'browse') {
      setBrowsePage(1)
      setBrowseWritings([])
      loadBrowseWritings(true)
    }
  }, [currentTab, browseSort, browseTopic])

  useEffect(() => {
    if (currentTab === 'featured') {
      loadFeaturedWritings()
    }
  }, [currentTab, featuredTopic])

  useEffect(() => {
    if (currentTab === 'my' && currentUser) {
      setMyPage(1)
      setMyWritings([])
      loadMyWritings(true)
    }
  }, [currentTab, currentUser])

  // 🚀 낙관적 업데이트를 적용한 좋아요 토글
  const handleLike = async (writingId: string) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.')
      return
    }

    // 이미 처리 중이면 무시
    if (likingWritings.has(writingId)) {
      return
    }

    // 현재 상태 백업 (롤백용)
    let previousBrowseWritings: WritingEntry[] = []
    let previousFeaturedWritings: WritingEntry[] = []
    
    if (currentTab === 'browse') {
      previousBrowseWritings = [...browseWritings]
    } else if (currentTab === 'featured') {
      previousFeaturedWritings = [...featuredWritings]
    }

    try {
      // 좋아요 처리 중 표시
      setLikingWritings(prev => new Set(prev).add(writingId))

      // 🚀 즉시 UI 업데이트 (낙관적 업데이트)
      const updateWritings = (writings: WritingEntry[]) => {
        return writings.map(writing => {
          if (writing.id === writingId) {
            const newIsLiked = !writing.is_liked
            const newLikesCount = writing.likes_count + (newIsLiked ? 1 : -1)
            return {
              ...writing,
              is_liked: newIsLiked,
              likes_count: Math.max(0, newLikesCount) // 음수 방지
            }
          }
          return writing
        })
      }

      if (currentTab === 'browse') {
        setBrowseWritings(updateWritings)
      } else if (currentTab === 'featured') {
        setFeaturedWritings(updateWritings)
      }

      // 서버에 요청
      const response = await fetch(`/api/writings/${writingId}/like`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        // 서버 응답과 동기화 (혹시 차이가 있을 경우를 대비)
        const syncWritings = (writings: WritingEntry[]) =>
          writings.map(writing =>
            writing.id === writingId
              ? {
                  ...writing,
                  is_liked: data.data.isLiked,
                  likes_count: data.data.likesCount
                }
              : writing
          )

        if (currentTab === 'browse') {
          setBrowseWritings(syncWritings)
        } else if (currentTab === 'featured') {
          setFeaturedWritings(syncWritings)
        }
      } else {
        // 에러 발생 시 원래 상태로 복원
        if (currentTab === 'browse') {
          setBrowseWritings(previousBrowseWritings)
        } else if (currentTab === 'featured') {
          setFeaturedWritings(previousFeaturedWritings)
        }
        
        // 에러 메시지 표시
        if (data.error && data.error !== '좋아요 처리에 실패했습니다.') {
          alert(data.error)
        }
      }
    } catch (error) {
      // 네트워크 에러 시 원래 상태로 복원
      if (currentTab === 'browse') {
        setBrowseWritings(previousBrowseWritings)
      } else if (currentTab === 'featured') {
        setFeaturedWritings(previousFeaturedWritings)
      }
      
      console.error('Error toggling like:', error)
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      // 좋아요 처리 완료
      setLikingWritings(prev => {
        const next = new Set(prev)
        next.delete(writingId)
        return next
      })
    }
  }

  // 필터 변경 핸들러들
  const handleBrowseSortChange = useCallback((sort: SortType) => {
    setBrowseSort(sort)
    setBrowsePage(1)
    setBrowseWritings([])
  }, [])

  const handleBrowseTopicChange = useCallback((topic: string) => {
    setBrowseTopic(topic)
    setBrowsePage(1)
    setBrowseWritings([])
  }, [])

  const handleFeaturedTopicChange = useCallback((topic: string) => {
    setFeaturedTopic(topic)
  }, [])

  return {
    // 상태
    browseWritings,
    featuredWritings,
    myWritings,
    browseSort,
    browseTopic,
    featuredTopic,
    browseHasMore,
    myHasMore,
    browsePage,
    myPage,
    totalWritings,
    loading,
    likingWritings, // 🚀 새로 추가
    
    // setter 함수들
    setBrowseSort: handleBrowseSortChange,
    setBrowseTopic: handleBrowseTopicChange,
    setFeaturedTopic: handleFeaturedTopicChange,
    setBrowsePage,
    setMyPage,
    
    // API 함수들
    loadBrowseWritings,
    loadFeaturedWritings,
    loadMyWritings,
    handleLike
  }
}