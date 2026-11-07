'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Eye, Calendar, Globe, FileText } from 'lucide-react'
import { Notice } from '@/types/admin'
import { sampleNotices } from '@/data/sampleData'

// 공지사항 작성/편집 모달
interface NoticeModalProps {
  notice: Notice | null
  isOpen: boolean
  onClose: () => void
  onSave: (notice: Notice) => void
}

function NoticeModal({ notice, isOpen, onClose, onSave }: NoticeModalProps) {
  const [formData, setFormData] = useState({
    title: notice?.title || '',
    content: notice?.content || '',
    category: notice?.category || '공지사항',
    isPublished: notice?.isPublished ?? true
  })

  const categories = ['공지사항', '모집공고', '이벤트', '안내사항', '보도자료']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    const newNotice: Notice = {
      id: notice?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      isPublished: formData.isPublished,
      createdAt: notice?.createdAt || new Date().toISOString().split('T')[0],
      views: notice?.views || 0
    }

    onSave(newNotice)
    onClose()
  }

  const resetForm = () => {
    setFormData({
      title: notice?.title || '',
      content: notice?.content || '',
      category: notice?.category || '공지사항',
      isPublished: notice?.isPublished ?? true
    })
  }

  React.useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen, notice])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {notice ? '공지사항 수정' : '공지사항 작성'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목과 카테고리 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="공지사항 내용을 입력하세요..."
            />
            <p className="text-sm text-gray-500 mt-1">
              마크다운 문법을 사용할 수 있습니다.
            </p>
          </div>

          {/* 발행 설정 */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="mr-2 w-4 h-4 text-orange-600"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                즉시 발행
              </label>
            </div>
            {!formData.isPublished && (
              <p className="text-sm text-orange-600">
                체크하지 않으면 임시저장됩니다.
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              {notice ? '수정' : '작성'} 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NoticesManagement() {
  const [notices, setNotices] = useState<Notice[]>(sampleNotices)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('전체') // 전체, 발행됨, 임시저장
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)

  const categories = ['전체', '공지사항', '모집공고', '이벤트', '안내사항', '보도자료']
  const statusOptions = ['전체', '발행됨', '임시저장']

  // 필터링된 공지사항 목록
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory
    
    const matchesStatus = statusFilter === '전체' ||
                         (statusFilter === '발행됨' && notice.isPublished) ||
                         (statusFilter === '임시저장' && !notice.isPublished)
    
    return matchesSearch && matchesCategory && matchesStatus
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // 통계 계산
  const stats = {
    total: notices.length,
    published: notices.filter(n => n.isPublished).length,
    draft: notices.filter(n => !n.isPublished).length,
    totalViews: notices.reduce((sum, n) => sum + n.views, 0)
  }

  // 공지사항 저장 (추가/수정)
  const handleSaveNotice = (notice: Notice) => {
    if (editingNotice) {
      setNotices(notices.map(n => n.id === notice.id ? notice : n))
    } else {
      setNotices([notice, ...notices])
    }
    setEditingNotice(null)
  }

  // 공지사항 삭제
  const handleDeleteNotice = (noticeId: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      setNotices(notices.filter(n => n.id !== noticeId))
    }
  }

  // 발행 상태 토글
  const togglePublishStatus = (noticeId: string) => {
    setNotices(notices.map(notice => 
      notice.id === noticeId ? { ...notice, isPublished: !notice.isPublished } : notice
    ))
  }

  // 공지사항 편집 모달 열기
  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          공지사항 작성
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 공지</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">발행된 공지</h3>
          <p className="text-3xl font-bold text-green-600">{stats.published}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">임시저장</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.draft}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 조회수</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            평균 {stats.published > 0 ? Math.round(stats.totalViews / stats.published) : 0}회
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
              placeholder="제목이나 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {/* 카테고리 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            공지사항 목록 ({filteredNotices.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* 제목과 상태 */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{notice.title}</h4>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      {notice.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      notice.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {notice.isPublished ? '발행됨' : '임시저장'}
                    </span>
                  </div>
                  
                  {/* 내용 미리보기 */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {notice.content}
                  </p>
                  
                  {/* 메타 정보 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {notice.createdAt}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {notice.views.toLocaleString()} 조회
                    </span>
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* 발행/임시저장 토글 */}
                  <button
                    onClick={() => togglePublishStatus(notice.id)}
                    className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                      notice.isPublished
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {notice.isPublished ? '임시저장' : '발행'}
                  </button>
                  
                  {/* 편집 */}
                  <button
                    onClick={() => handleEditNotice(notice)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                    title="편집"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {/* 삭제 */}
                  <button
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 결과 없음 메시지 */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {notices.length === 0 
                ? '작성된 공지사항이 없습니다.' 
                : '검색 조건에 맞는 공지사항이 없습니다.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 공지사항 작성/편집 모달 */}
      <NoticeModal
        notice={editingNotice}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingNotice(null)
        }}
        onSave={handleSaveNotice}
      />
    </div>
  )
}