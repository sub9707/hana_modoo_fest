'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseInfiniteScrollOptions {
  /** 더 불러올 데이터가 있는지 */
  hasMore: boolean
  /** 현재 요청 중인지 */
  isLoading: boolean
  /** 다음 페이지 요청 */
  onLoadMore: () => void
  /** 화면 하단에서 얼마나 미리 불러올지 */
  rootMargin?: string
  /** 일시적으로 끄고 싶을 때 (예: 다른 탭 표시 중) */
  enabled?: boolean
}

/**
 * 목록 끝의 sentinel 요소가 보이면 다음 페이지를 불러온다.
 *
 * IntersectionObserver 는 "보임 상태가 바뀔 때"만 콜백을 준다.
 * 그래서 로딩이 끝난 뒤에도 sentinel 이 계속 화면 안에 있으면 다음 이벤트가 오지 않아
 * 사용자가 살짝 올렸다 내려야 로드되는 문제가 생긴다.
 * 여기서는 로딩이 끝날 때마다 observer 를 새로 붙인다. observe() 는 붙는 즉시
 * 현재 상태로 콜백을 한 번 호출하므로, 아직 보이면 바로 다음 페이지를 이어서 불러온다.
 *
 * 반환값은 callback ref 이므로 sentinel 요소에 `ref={sentinelRef}` 로 붙이면 된다.
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '0px 0px 400px 0px',
  enabled = true,
}: UseInfiniteScrollOptions) {
  const [sentinel, setSentinel] = useState<Element | null>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    if (!sentinel || !enabled || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current()
      },
      { rootMargin }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinel, enabled, hasMore, isLoading, rootMargin])

  return useCallback((node: Element | null) => setSentinel(node), [])
}
