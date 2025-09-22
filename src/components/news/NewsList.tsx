'use client'

import { useState, useEffect } from 'react'
import NewsCard from './NewsCard'
import NewsDetail from './NewsDetail'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useInfiniteNews } from '@/hooks/useInfiniteNews'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { NewsSearchParams, NewsItem } from '@/types/Board'

interface NewsListProps {
  searchParams: NewsSearchParams
}

export default function NewsList({ searchParams }: NewsListProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useInfiniteNews(searchParams)

  const { targetRef } = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: !loading && hasMore && !selectedNews // 상세 화면에서는 무한스크롤 비활성화
  })

  // 뉴스 카드 클릭 핸들러 (상세 정보 로드)
  const handleCardClick = async (newsItem: NewsItem) => {
    setLoadingDetail(true)
    try {
      const response = await fetch(`/api/news/${newsItem.id}`)
      if (response.ok) {
        const detailData = await response.json()
        setSelectedNews(detailData)
      } else {
        console.error('Failed to load news detail')
      }
    } catch (error) {
      console.error('Error loading news detail:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedNews(null)
  }

  // 검색 조건 변경 시 상세 화면 초기화
  useEffect(() => {
    setSelectedNews(null)
  }, [searchParams.category, searchParams.search, searchParams.sort])


  // 상세 화면 렌더링
  if (selectedNews) {
    return <NewsDetail news={selectedNews} onBack={handleBack} />
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">뉴스를 불러오는 중 오류가 발생했습니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    )
  }

  // 뉴스 리스트 렌더링
  const importantNews = news.filter(item => item.important)
  const regularNews = news.filter(item => !item.important)

  return (
    <div className="space-y-6">
      {/* 검색 결과 정보 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchParams.search 
            ? `'${searchParams.search}' 검색 결과` 
            : searchParams.category && searchParams.category !== 'all'
              ? `${searchParams.category} 소식`
              : '전체 소식'
          }
        </h2>
        <p className="text-gray-600">
          총 {totalCount.toLocaleString()}개의 글
        </p>
      </div>

      {/* 중요 공지 섹션 */}
      {importantNews.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <div className="font-semibold text-red-800 mb-4 flex items-center">
            📢 중요 공지
          </div>
          <div className="space-y-4">
            {importantNews.map((news, idx) => (
              <div key={news.id + " " + idx} className="bg-white rounded-lg p-4">
                <NewsCard 
                  news={news} 
                  onClick={() => handleCardClick(news)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 뉴스 리스트 */}
      <div className="space-y-4">
        {regularNews.map((news, idx) => (
          <NewsCard 
            key={news.id + " " + idx} 
            news={news} 
            onClick={() => handleCardClick(news)}
          />
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* 무한스크롤 트리거 */}
      <div ref={targetRef} className="h-4" />

      {/* 더 이상 로드할 뉴스가 없을 때 */}
      {!hasMore && news.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 뉴스를 확인했습니다.
        </div>
      )}

      {/* 뉴스가 없을 때 */}
      {!loading && news.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchParams.search 
              ? '검색 결과가 없습니다.'
              : '등록된 뉴스가 없습니다.'
            }
          </p>
          {searchParams.search && (
            <p className="text-gray-400">
              다른 키워드로 검색해보세요.
            </p>
          )}
        </div>
      )}
    </div>
  )
}