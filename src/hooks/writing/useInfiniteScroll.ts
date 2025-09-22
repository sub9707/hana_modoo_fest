import { useEffect, useRef } from 'react'
import { TabType, User } from '@/types/writing'

interface UseInfiniteScrollProps {
  currentTab: TabType
  currentUser: User | null
  browseHasMore: boolean
  myHasMore: boolean
  loading: boolean
  loadBrowseWritings: () => void
  loadMyWritings: () => void
}

export function useInfiniteScroll({
  currentTab,
  currentUser,
  browseHasMore,
  myHasMore,
  loading,
  loadBrowseWritings,
  loadMyWritings
}: UseInfiniteScrollProps) {
  // 스크롤 이벤트 중복 방지를 위한 ref
  const isScrollingRef = useRef(false)

  // 윈도우 스크롤 이벤트로 무한 스크롤 구현
  useEffect(() => {
    const handleScroll = () => {
      // 이미 스크롤 처리 중이거나 로딩 중이면 중단
      if (isScrollingRef.current || loading) return

      // 페이지 끝에서 100px 전에 도달했을 때 로딩 시작
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        isScrollingRef.current = true

        if (currentTab === 'browse' && browseHasMore) {
          loadBrowseWritings()
        } else if (currentTab === 'my' && myHasMore && currentUser) {
          loadMyWritings()
        }

        // 1초 후 스크롤 이벤트 재활성화
        setTimeout(() => {
          isScrollingRef.current = false
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentTab, browseHasMore, myHasMore, loading, currentUser])

  // 탭 변경 시 스크롤 상태 초기화
  useEffect(() => {
    isScrollingRef.current = false
  }, [currentTab])
}