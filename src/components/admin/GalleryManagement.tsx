'use client'

import React, { useState } from 'react'
import { Plus, Eye, EyeOff, Trash2, Search, Filter, Image, Calendar, User } from 'lucide-react'
import { GalleryPhoto } from '@/types/admin'
import { samplePhotos } from '@/data/sampleData'

// 사진 업로드 모달
interface PhotoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (photo: Omit<GalleryPhoto, 'id' | 'uploadedAt' | 'isBlurred'>) => void
}

function PhotoUploadModal({ isOpen, onClose, onUpload }: PhotoUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '개막식',
    photographer: ''
  })

  const categories = ['개막식', '체험부스', '공연', '자조모임', '순간포착', '기타']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    onUpload({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      photographer: formData.photographer || undefined
    })

    setFormData({ title: '', description: '', category: '개막식', photographer: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">사진 업로드</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 파일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사진 파일</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">사진을 드래그하거나 클릭하여 업로드</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="사진 제목을 입력하세요"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="사진에 대한 설명을 입력하세요"
            />
          </div>

          {/* 카테고리 */}
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

          {/* 촬영자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">촬영자</label>
            <input
              type="text"
              value={formData.photographer}
              onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="촬영자명 (선택사항)"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
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
              업로드
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GalleryManagement() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(samplePhotos)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('전체') // 전체, 공개됨, Blur처리됨

  const categories = ['전체', '개막식', '체험부스', '공연', '자조모임', '순간포착', '기타']
  const statusOptions = ['전체', '공개됨', 'Blur처리됨']

  // 필터링된 사진 목록
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '전체' || photo.category === selectedCategory
    
    const matchesStatus = statusFilter === '전체' ||
                         (statusFilter === '공개됨' && !photo.isBlurred) ||
                         (statusFilter === 'Blur처리됨' && photo.isBlurred)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Blur 상태 토글
  const toggleBlur = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, isBlurred: !photo.isBlurred } : photo
    ))
  }

  // 사진 삭제
  const handleDeletePhoto = (photoId: string) => {
    if (confirm('이 사진을 삭제하시겠습니까?')) {
      setPhotos(photos.filter(p => p.id !== photoId))
    }
  }

  // 사진 업로드
  const handlePhotoUpload = (photoData: Omit<GalleryPhoto, 'id' | 'uploadedAt' | 'isBlurred'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString().split('T')[0],
      isBlurred: true // 초기값으로 blur 처리
    }
    setPhotos([newPhoto, ...photos])
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">갤러리 관리</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          사진 업로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 사진</h3>
          <p className="text-3xl font-bold text-orange-600">{photos.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">공개된 사진</h3>
          <p className="text-3xl font-bold text-green-600">
            {photos.filter(p => !p.isBlurred).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blur 처리</h3>
          <p className="text-3xl font-bold text-orange-600">
            {photos.filter(p => p.isBlurred).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">대기 중</h3>
          <p className="text-3xl font-bold text-red-600">
            {photos.filter(p => p.isBlurred).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">검토 필요</p>
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
              placeholder="제목이나 설명으로 검색..."
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

      {/* 사진 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            사진 목록 ({filteredPhotos.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  {/* 썸네일 */}
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  {/* 사진 정보 */}
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{photo.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{photo.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        {photo.category}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {photo.uploadedAt}
                      </span>
                      {photo.photographer && (
                        <span className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {photo.photographer}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 액션 영역 */}
                <div className="flex items-center space-x-3 ml-4">
                  {/* 공개 상태 */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">공개 상태:</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      photo.isBlurred 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {photo.isBlurred ? 'Blur 처리됨' : '공개됨'}
                    </span>
                  </div>
                  
                  {/* 공개/Blur 토글 버튼 */}
                  <button
                    onClick={() => toggleBlur(photo.id)}
                    className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                      photo.isBlurred 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {photo.isBlurred ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        공개
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Blur
                      </>
                    )}
                  </button>
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 결과 없음 메시지 */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 조건에 맞는 사진이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 사진 업로드 모달 */}
      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handlePhotoUpload}
      />
    </div>
  )
}