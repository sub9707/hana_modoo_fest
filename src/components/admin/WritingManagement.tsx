'use client'

import React, { useState } from 'react'
import { Search, Filter, Award, Eye, Heart, TrendingUp, Calendar, User, Star, Download } from 'lucide-react'
import { Writing } from '@/types/admin'
import { sampleWritings } from '@/data/sampleData'

// 글 상세 보기 모달
interface WritingModalProps {
  writing: Writing | null
  isOpen: boolean
  onClose: () => void
  onToggleSelected: (writingId: string) => void
}

function WritingModal({ writing, isOpen, onClose, onToggleSelected }: WritingModalProps) {
  if (!isOpen || !writing) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">글 상세 보기</h3>
          {writing.isSelected && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Award className="w-3 h-3 mr-1" />
              우수작품
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* 작품 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium text-sm">
                  {writing.author[0]}
                </div>
                <span className="text-gray-900">{writing.author}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작성일</label>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {writing.createdAt}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주제</label>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                {writing.topic}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">통계</label>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {writing.views}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {writing.likes}
                </span>
              </div>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <h4 className="text-xl font-bold text-gray-900">{writing.title}</h4>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{writing.content}</p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={() => {
              onToggleSelected(writing.id)
              onClose()
            }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              writing.isSelected
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            <Award className="w-4 h-4 mr-1" />
            {writing.isSelected ? '우수작 해제' : '우수작 선정'}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WritingManagement() {
  const [writings, setWritings] = useState<Writing[]>(sampleWritings)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('전체')
  const [sortBy, setSortBy] = useState('latest') // latest, views, likes
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 주제 목록 추출
  const allTopics = ['전체', ...new Set(writings.map(w => w.topic))]
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'views', label: '조회수순' },
    { value: 'likes', label: '좋아요순' },
    { value: 'selected', label: '우수작 우선' }
  ]

  // 필터링 및 정렬
  const filteredAndSortedWritings = writings
    .filter(writing => {
      const matchesSearch = writing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           writing.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           writing.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTopic = selectedTopic === '전체' || writing.topic === selectedTopic
      
      return matchesSearch && matchesTopic
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views
        case 'likes':
          return b.likes - a.likes
        case 'selected':
          if (a.isSelected && !b.isSelected) return -1
          if (!a.isSelected && b.isSelected) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // 통계 계산
  const stats = {
    total: writings.length,
    selected: writings.filter(w => w.isSelected).length,
    totalViews: writings.reduce((sum, w) => sum + w.views, 0),
    totalLikes: writings.reduce((sum, w) => sum + w.likes, 0)
  }

  // 우수작 선정/해제
  const toggleSelected = (writingId: string) => {
    setWritings(writings.map(writing => 
      writing.id === writingId ? { ...writing, isSelected: !writing.isSelected } : writing
    ))
  }

  // 엑셀 다운로드
  const handleExportExcel = () => {
    console.log('글짓기 통계 엑셀 추출 시작...')
    // 실제로는 API 호출하여 엑셀 파일 생성 후 다운로드
  }

  // 글 상세 보기
  const handleViewWriting = (writing: Writing) => {
    setSelectedWriting(writing)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">가족주제 글짓기 관리</h2>
        <button 
          onClick={handleExportExcel}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          통계 엑셀 추출
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 작품</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">우수작품</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.selected}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.selected / stats.total) * 100) : 0}% 선정
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 조회수</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            평균 {stats.total > 0 ? Math.round(stats.totalViews / stats.total) : 0}회
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 좋아요</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            평균 {stats.total > 0 ? Math.round(stats.totalLikes / stats.total) : 0}개
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색창 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="제목, 내용, 작성자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {/* 주제 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {allTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          {/* 정렬 옵션 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 인기 주제 분석 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주제별 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTopics.slice(1).map(topic => {
            const topicWritings = writings.filter(w => w.topic === topic)
            const avgViews = topicWritings.length > 0 
              ? Math.round(topicWritings.reduce((sum, w) => sum + w.views, 0) / topicWritings.length)
              : 0
            
            return (
              <div key={topic} className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">{topic}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>작품 수: {topicWritings.length}개</div>
                  <div>평균 조회수: {avgViews}회</div>
                  <div>우수작: {topicWritings.filter(w => w.isSelected).length}개</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 글 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            글 목록 ({filteredAndSortedWritings.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAndSortedWritings.map((writing, index) => (
            <div key={writing.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4 flex-1">
                  {/* 순위/프로필 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium text-sm">
                      {writing.author[0]}
                    </div>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  
                  {/* 글 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{writing.title}</h4>
                      {writing.isSelected && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          우수작
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {writing.author}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {writing.topic}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {writing.createdAt}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {writing.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {writing.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {writing.likes}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {writing.views > 0 ? Math.round((writing.likes / writing.views) * 100) : 0}% 좋아요율
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewWriting(writing)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                    title="상세 보기"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => toggleSelected(writing.id)}
                    className={`p-2 rounded-md transition-colors ${
                      writing.isSelected
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-yellow-600 hover:bg-yellow-50'
                    }`}
                    title={writing.isSelected ? '우수작 해제' : '우수작 선정'}
                  >
                    <Star className={`w-4 h-4 ${writing.isSelected ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 결과 없음 메시지 */}
        {filteredAndSortedWritings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {writings.length === 0 
                ? '등록된 글이 없습니다.' 
                : '검색 조건에 맞는 글이 없습니다.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 글 상세 보기 모달 */}
      <WritingModal
        writing={selectedWriting}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedWriting(null)
        }}
        onToggleSelected={toggleSelected}
      />
    </div>
  )
}