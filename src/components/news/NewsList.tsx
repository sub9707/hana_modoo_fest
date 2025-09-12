'use client'

import { useState } from 'react'
import NewsCard from './NewsCard'
import NewsDetail from './NewsDetail'

interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
  content: string
  views: number
  important: boolean
  author: string
}

export default function NewsList() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  
  // 샘플 뉴스 데이터
  const newsList: NewsItem[] = [
    {
      id: '1',
      title: '모두하나대축제 2025 사전참가 신청 시작',
      category: '공지사항',
      date: '2025-09-12',
      summary: '10월 18일 개최되는 모두하나대축제 2025의 사전참가 신청을 받습니다.',
      content: '서울특별시가 주최하고 서울특별시한부모가족지원센터가 주관하는 모두하나대축제 2025가 10월 18일(토) 여의도공원 문화의마당에서 개최됩니다...',
      views: 1524,
      important: true,
      author: '서울특별시한부모가족지원센터'
    },
    {
      id: '2',
      title: '온라인 포토 챌린지 이벤트 당첨자 발표',
      category: '당첨자발표',
      date: '2025-09-10',
      summary: '#모두하나대축제2025 해시태그 이벤트 당첨자를 발표합니다.',
      content: '9월 첫째 주 진행된 온라인 포토 챌린지 이벤트의 당첨자를 발표합니다...',
      views: 892,
      important: false,
      author: '서울특별시한부모가족지원센터'
    },
    {
      id: '3',
      title: '자원봉사자 모집 안내',
      category: '모집공고',
      date: '2025-09-08',
      summary: '축제 당일 함께 도움을 주실 자원봉사자를 모집합니다.',
      content: '모두하나대축제 2025 성공적 개최를 위해 자원봉사자를 모집합니다...',
      views: 1205,
      important: false,
      author: '서울특별시한부모가족지원센터'
    },
    {
      id: '4',
      title: '부스 운영 단체 모집',
      category: '모집공고',
      date: '2025-09-05',
      summary: '축제 당일 체험부스 및 홍보부스를 운영할 단체를 모집합니다.',
      content: '다양한 가족지원 프로그램과 체험활동을 제공할 부스 운영 단체를 모집합니다...',
      views: 743,
      important: false,
      author: '서울특별시한부모가족지원센터'
    },
    {
      id: '5',
      title: '교통편 및 주차장 이용 안내',
      category: '현장안내',
      date: '2025-09-03',
      summary: '축제 당일 교통편과 주차장 이용에 대한 상세 안내입니다.',
      content: '여의도공원 문화의마당 오시는 길과 주차장 이용 안내를 드립니다...',
      views: 2108,
      important: true,
      author: '서울특별시한부모가족지원센터'
    },
    {
      id: '6',
      title: '가족사진 촬영 이벤트 안내',
      category: '이벤트',
      date: '2025-09-01',
      summary: '축제 당일 무료 가족사진 촬영 이벤트를 진행합니다.',
      content: '전문 사진작가와 함께하는 무료 가족사진 촬영 이벤트를 진행합니다...',
      views: 1687,
      important: false,
      author: '서울특별시한부모가족지원센터'
    }
  ]

  if (selectedNews) {
    return (
      <NewsDetail 
        news={selectedNews} 
        onBack={() => setSelectedNews(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* 중요 공지 */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="font-semibold text-red-800 mb-2">📢 중요 공지</div>
        <p className="text-red-700">
          사전참가 신청이 시작되었습니다! 원활한 축제 참여를 위해 사전신청을 권장합니다.
        </p>
      </div>

      {/* 뉴스 리스트 */}
      <div className="space-y-4">
        {newsList.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onClick={() => setSelectedNews(news)}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
          이전
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`px-3 py-2 rounded-lg ${
              page === 1
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          다음
        </button>
      </div>
    </div>
  )
}