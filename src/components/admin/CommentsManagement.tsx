'use client'

import React, { useState } from 'react'
import { Search, Filter, CheckCircle, XCircle, Eye, Trash2, MessageSquare, Calendar, Clock } from 'lucide-react'
import { Comment } from '@/types/admin'
import { sampleComments } from '@/data/sampleData'

// 댓글 상세 보기 모달
interface CommentModalProps {
  comment: Comment | null
  isOpen: boolean
  onClose: () => void
  onApprove: (commentId: string) => void
  onReject: (commentId: string) => void
  onDelete: (commentId: string) => void
}

function CommentModal({ comment, isOpen, onClose, onApprove, onReject, onDelete }: CommentModalProps) {
  if (!isOpen || !comment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">댓글 상세</h3>
        
        <div className="space-y-4">
          {/* 작성자 정보 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium text-sm">
                {comment.author[0]}
              </div>
              <span className="text-gray-900">{comment.author}</span>
            </div>
          </div>

          {/* 작성일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작성일</label>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {comment.createdAt}
            </div>
          </div>

          {/* 댓글 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-900">{comment.content}</p>
            </div>
          </div>

          {/* 승인 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
              comment.isApproved
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {comment.isApproved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  승인됨
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-1" />
                  승인 대기
                </>
              )}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={() => {
              onDelete(comment.id)
              onClose()
            }}
            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            삭제
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
            
            {!comment.isApproved ? (
              <>
                <button
                  onClick={() => {
                    onReject(comment.id)
                    onClose()
                  }}
                  className="flex items-center px-4 py-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  거부
                </button>
                <button
                  onClick={() => {
                    onApprove(comment.id)
                    onClose()
                  }}
                  className="flex items-center px-4 py-2 text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  승인
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onReject(comment.id)
                  onClose()
                }}
                className="flex items-center px-4 py-2 text-orange-600 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1" />
                승인 취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>(sampleComments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체') // 전체, 승인됨, 승인대기, 거부됨
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showModal, setShowModal] = useState(false)

  const statusOptions = ['전체', '승인됨', '승인 대기']

  // 필터링된 댓글 목록
  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '전체' ||
                         (statusFilter === '승인됨' && comment.isApproved) ||
                         (statusFilter === '승인 대기' && !comment.isApproved)
    
    return matchesSearch && matchesStatus
  })

  // 댓글 승인
  const handleApprove = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, isApproved: true } : comment
    ))
  }

  // 댓글 거부/승인 취소
  const handleReject = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, isApproved: false } : comment
    ))
  }

  // 댓글 삭제
  const handleDelete = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId))
  }

  // 대량 승인
  const handleBulkApprove = () => {
    const pendingComments = comments.filter(c => !c.isApproved)
    if (pendingComments.length > 0 && confirm(`${pendingComments.length}개의 댓글을 모두 승인하시겠습니까?`)) {
      setComments(comments.map(comment => ({ ...comment, isApproved: true })))
    }
  }

  // 댓글 상세 보기
  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">응원댓글 관리</h2>
        <button 
          onClick={handleBulkApprove}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          대기 중 댓글 모두 승인
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 댓글</h3>
          <p className="text-3xl font-bold text-orange-600">{comments.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">승인된 댓글</h3>
          <p className="text-3xl font-bold text-green-600">
            {comments.filter(c => c.isApproved).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">승인 대기</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {comments.filter(c => !c.isApproved).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">승인률</h3>
          <p className="text-3xl font-bold text-gray-900">
            {comments.length > 0 ? Math.round((comments.filter(c => c.isApproved).length / comments.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색창 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="작성자명이나 댓글 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {/* 상태 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
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
      </div>

      {/* 댓글 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            댓글 목록 ({filteredComments.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4 flex-1">
                  {/* 프로필 아이콘 */}
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium flex-shrink-0">
                    {comment.author[0]}
                  </div>
                  
                  {/* 댓글 내용 */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comment.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comment.isApproved ? '승인됨' : '승인 대기'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewComment(comment)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                    title="상세 보기"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {!comment.isApproved ? (
                    <>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="거부"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="승인"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                      title="승인 취소"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (confirm('이 댓글을 삭제하시겠습니까?')) {
                        handleDelete(comment.id)
                      }
                    }}
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
        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {comments.length === 0 
                ? '등록된 댓글이 없습니다.' 
                : '검색 조건에 맞는 댓글이 없습니다.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 댓글 상세 보기 모달 */}
      <CommentModal
        comment={selectedComment}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedComment(null)
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </div>
  )
}