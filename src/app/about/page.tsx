import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '기관 소개',
  description: '서울특별시한부모가족지원센터의 비전과 주요 사업을 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            기관 소개
          </h1>
          <p className="text-xl text-slate-600">
            서울특별시한부모가족지원센터
          </p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">센터 소개</h2>
            <p className="text-lg leading-relaxed text-slate-700 mb-4">
              서울특별시한부모가족지원센터는 한부모가족의 자립과 복지 향상을 위해 설립된 전문기관입니다.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              다양한 지원 서비스와 프로그램을 통해 한부모가족이 건강하고 행복한 삶을 영위할 수 있도록 돕고 있습니다.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-8 text-center">비전과 가치</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">돌봄</h3>
                <p className="text-slate-600">따뜻한 보살핌으로 가족을 지원합니다</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">소통</h3>
                <p className="text-slate-600">열린 마음으로 함께 나눕니다</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">혁신</h3>
                <p className="text-slate-600">새로운 변화를 만들어갑니다</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">주요 사업</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">상담 지원</h3>
                <p className="text-slate-600">개별 상담, 집단 상담, 가족 상담 등 맞춤형 상담 서비스</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">자조모임 운영</h3>
                <p className="text-slate-600">한부모가족 간 네트워킹과 상호 지원 프로그램</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">교육 프로그램</h3>
                <p className="text-slate-600">부모교육, 자녀교육, 취업 교육 등 다양한 교육 지원</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">문화 행사</h3>
                <p className="text-slate-600">가족 나들이, 축제, 캠프 등 문화 활동 지원</p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <Button asChild size="lg">
              <a 
                href="https://seoul.go.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                센터 홈페이지 방문하기
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}