import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `공지사항 - ${params.id}`,
    description: '모두하나대축제 2025 공지사항',
  }
}

export default function NewsDetailPage({ params }: Props) {
  // 실제로는 API에서 뉴스 데이터를 가져올 것
  const news = {
    id: params.id,
    title: '모두하나대축제 2025 자원봉사자 모집',
    category: '모집',
    publishedAt: '2025-09-05',
    updatedAt: '2025-09-06',
    author: '서울특별시한부모가족지원센터',
    views: 1247,
    content: `
      안녕하세요. 서울특별시한부모가족지원센터입니다.

      오는 10월 18일(토) 개최되는 모두하나대축제 2025에서 함께할 자원봉사자를 모집합니다.

      ## 모집 개요
      - **모집 기간**: 2025년 9월 5일(목) ~ 9월 30일(월)
      - **활동 일시**: 2025년 10월 18일(토) 10:00 ~ 17:00
      - **활동 장소**: 여의도공원 문화의마당
      - **모집 인원**: 총 100명

      ## 활동 내용
      1. **접수 및 안내** (20명)
         - 참가자 접수 및 행사 안내
         - 프로그램 문의 응답

      2. **무대 운영** (15명)
         - 무대 진행 보조
         - 장비 관리 지원

      3. **체험 부스 운영** (30명)
         - 각종 체험 프로그램 운영 지원
         - 참가자 안전 관리

      4. **자조모임 지원** (20명)
         - 자조모임 부스 운영 지원
         - 네트워킹 활동 도움

      5. **기타 업무** (15명)
         - 정리정돈 및 청소
         - 기타 필요 업무

      ## 신청 방법
      아래 링크를 통해 온라인으로 신청해주세요.
      
      [자원봉사 신청하기](/volunteer/apply)

      ## 자원봉사 혜택
      - 자원봉사 확인서 발급
      - 기념품 증정
      - 중식 제공
      - 자원봉사 시간 인정 (7시간)

      많은 관심과 참여 부탁드립니다.

      감사합니다.
    `
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Link>
          </Button>
        </div>

        {/* 뉴스 헤더 */}
        <article className="mb-8">
          <div className="mb-6">
            <Badge className="mb-4">{news.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{news.publishedAt}</span>
              </div>
              <span>작성자: {news.author}</span>
              <span>조회수: {news.views.toLocaleString()}</span>
              {news.updatedAt !== news.publishedAt && (
                <span>수정: {news.updatedAt}</span>
              )}
            </div>
          </div>

          {/* 뉴스 본문 */}
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-line leading-relaxed">
              {news.content}
            </div>
          </div>

          {/* 공유 버튼 */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">이 글이 유용했다면 공유해주세요</span>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </article>

        {/* 관련 글 */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-6">관련 공지사항</h2>
          <div className="space-y-4">
            {[
              {
                title: '온라인 해시태그 챌린지 이벤트 시작!',
                date: '2025-09-03',
                category: '이벤트'
              },
              {
                title: '축제 프로그램 타임테이블 공개',
                date: '2025-09-01',
                category: '현장안내'
              }
            ].map((related, index) => (
              <Link
                key={index}
                href={`/news/${index + 2}`}
                className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">{related.title}</h3>
                    <p className="text-sm text-slate-500">{related.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {related.category}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}