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
  const [totalWritings, setTotalWritings] = useState(0)
  const [browseLoading, setBrowseLoading] = useState(false)
  const [myLoading, setMyLoading] = useState(false)
  const [likingWritings, setLikingWritings] = useState<Set<string>>(new Set())

  // 다음 요청 페이지 / 최신 요청 번호 (필터가 바뀌면 이전 응답은 버린다)
  const browseNextPageRef = useRef(1)
  const browseRequestIdRef = useRef(0)
  const browseLoadingRef = useRef(false)
  const myNextPageRef = useRef(1)
  const myRequestIdRef = useRef(0)
  const myLoadingRef = useRef(false)

  const appendUnique = (prev: WritingEntry[], incoming: WritingEntry[]) => {
    const seen = new Set(prev.map(w => w.id))
    return [...prev, ...incoming.filter(w => !seen.has(w.id))]
  }

  const loadBrowseWritings = useCallback(async (reset = false) => {
    if (!reset && browseLoadingRef.current) return

    const requestId = ++browseRequestIdRef.current
    const page = reset ? 1 : browseNextPageRef.current
    browseLoadingRef.current = true
    setBrowseLoading(true)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: browseSort,
        topic: browseTopic
      })
      const response = await fetch(`/api/writings?${params}`)
      const data = await response.json()
      if (requestId !== browseRequestIdRef.current) return

      if (data.success) {
        const incoming: WritingEntry[] = data.data.writings
        setBrowseWritings(prev => (reset ? incoming : appendUnique(prev, incoming)))
        setBrowseHasMore(data.data.pagination.hasMore)
        setTotalWritings(Number(data.data.pagination.totalCount) || 0)
        browseNextPageRef.current = page + 1
      } else {
        setBrowseHasMore(false)
      }
    } catch (error) {
      console.error('Error loading browse writings:', error)
      if (requestId === browseRequestIdRef.current) setBrowseHasMore(false)
    } finally {
      if (requestId === browseRequestIdRef.current) {
        browseLoadingRef.current = false
        setBrowseLoading(false)
      }
    }
  }, [browseSort, browseTopic])

  const loadFeaturedWritings = useCallback(async () => {
    try {
      const params = new URLSearchParams({ topic: featuredTopic })
      const response = await fetch(`/api/writings/featured?${params}`)
      const data = await response.json()
      if (data.success) {
        setFeaturedWritings(data.data.writings)
      }
    } catch (error) {
      console.error('Error loading featured writings:', error)
    }
  }, [featuredTopic])

  const loadMyWritings = useCallback(async (reset = false) => {
    if (!currentUser) return
    if (!reset && myLoadingRef.current) return

    const requestId = ++myRequestIdRef.current
    const page = reset ? 1 : myNextPageRef.current
    myLoadingRef.current = true
    setMyLoading(true)

    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' })
      const response = await fetch(`/api/writings/my?${params}`)
      const data = await response.json()
      if (requestId !== myRequestIdRef.current) return

      if (data.success) {
        const incoming: WritingEntry[] = data.data.writings
        setMyWritings(prev => (reset ? incoming : appendUnique(prev, incoming)))
        setMyHasMore(data.data.pagination.hasMore)
        myNextPageRef.current = page + 1
      } else {
        setMyHasMore(false)
      }
    } catch (error) {
      console.error('Error loading my writings:', error)
      if (requestId === myRequestIdRef.current) setMyHasMore(false)
    } finally {
      if (requestId === myRequestIdRef.current) {
        myLoadingRef.current = false
        setMyLoading(false)
      }
    }
  }, [currentUser])

  // 탭/필터 변경 시 처음부터 다시 로드
  useEffect(() => {
    if (currentTab !== 'browse') return
    setBrowseHasMore(true)
    loadBrowseWritings(true)
  }, [currentTab, loadBrowseWritings])

  useEffect(() => {
    if (currentTab === 'featured') {
      loadFeaturedWritings()
    }
  }, [currentTab, loadFeaturedWritings])

  useEffect(() => {
    if (currentTab !== 'my' || !currentUser) return
    setMyHasMore(true)
    loadMyWritings(true)
  }, [currentTab, currentUser, loadMyWritings])

  // 낙관적 업데이트를 적용한 좋아요 토글
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

      // 즉시 UI 업데이트 (낙관적 업데이트)
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
        if (data.error) {
          console.error('좋아요 에러:', data.error)
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

  // 필터 변경: 상태만 바꾸면 위 effect 가 처음부터 다시 불러온다
  const handleBrowseSortChange = useCallback((sort: SortType) => setBrowseSort(sort), [])
  const handleBrowseTopicChange = useCallback((topic: string) => setBrowseTopic(topic), [])
  const handleFeaturedTopicChange = useCallback((topic: string) => setFeaturedTopic(topic), [])

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
    totalWritings,
    browseLoading,
    myLoading,
    likingWritings,
    
    // setter 함수들
    setBrowseSort: handleBrowseSortChange,
    setBrowseTopic: handleBrowseTopicChange,
    setFeaturedTopic: handleFeaturedTopicChange,
    
    // API 함수들
    loadBrowseWritings,
    loadFeaturedWritings,
    loadMyWritings,
    handleLike
  }
}