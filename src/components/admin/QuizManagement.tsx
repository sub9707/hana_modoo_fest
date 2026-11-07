'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search, Filter, CheckCircle, XCircle } from 'lucide-react'
import { Quiz } from '@/types/admin'
import { sampleQuizzes } from '@/data/sampleData'

// 퀴즈 추가/편집 모달 컴포넌트
interface QuizModalProps {
  quiz: Quiz | null
  isOpen: boolean
  onClose: () => void
  onSave: (quiz: Quiz) => void
}

function QuizModal({ quiz, isOpen, onClose, onSave }: QuizModalProps) {
  const [formData, setFormData] = useState<Partial<Quiz>>({
    question: quiz?.question || '',
    options: quiz?.options || ['', '', '', ''],
    correctAnswer: quiz?.correctAnswer || 0,
    category: quiz?.category || '가족통계',
    explanation: quiz?.explanation || '',
    isActive: quiz?.isActive ?? true
  })

  const categories = ['가족통계', '가족개념', '기관정보', '축제정보', '가족관계']

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options!]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question?.trim() || formData.options?.some(opt => !opt.trim())) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    const newQuiz: Quiz = {
      id: quiz?.id || Date.now().toString(),
      question: formData.question!,
      options: formData.options!,
      correctAnswer: formData.correctAnswer!,
      category: formData.category!,
      explanation: formData.explanation!,
      isActive: formData.isActive!
    }

    onSave(newQuiz)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {quiz ? '퀴즈 수정' : '퀴즈 추가'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리 선택 */}
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

          {/* 질문 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="퀴즈 질문을 입력하세요..."
            />
          </div>

          {/* 선택지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">선택지</label>
            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === index}
                      onChange={() => setFormData({ ...formData, correctAnswer: index })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder={`선택지 ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">정답을 라디오 버튼으로 선택하세요.</p>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="정답에 대한 설명을 입력하세요..."
            />
          </div>

          {/* 활성화 상태 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              퀴즈 활성화
            </label>
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
              {quiz ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(sampleQuizzes)
  const [showModal, setShowModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', '가족통계', '가족개념', '기관정보', '축제정보', '가족관계']

  // 필터링된 퀴즈 목록
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '전체' || quiz.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 퀴즈 추가/수정
  const handleSaveQuiz = (quiz: Quiz) => {
    if (editingQuiz) {
      setQuizzes(quizzes.map(q => q.id === quiz.id ? quiz : q))
    } else {
      setQuizzes([...quizzes, quiz])
    }
    setEditingQuiz(null)
  }

  // 퀴즈 삭제
  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('이 퀴즈를 삭제하시겠습니까?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId))
    }
  }

  // 퀴즈 활성화/비활성화
  const toggleQuizActive = (quizId: string) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === quizId ? { ...quiz, isActive: !quiz.isActive } : quiz
    ))
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">퀴즈 관리</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          퀴즈 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 퀴즈</h3>
          <p className="text-3xl font-bold text-orange-600">{quizzes.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">활성 퀴즈</h3>
          <p className="text-3xl font-bold text-green-600">
            {quizzes.filter(q => q.isActive).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">비활성 퀴즈</h3>
          <p className="text-3xl font-bold text-gray-600">
            {quizzes.filter(q => !q.isActive).length}
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
              placeholder="질문이나 설명으로 검색..."
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
        </div>
      </div>

      {/* 퀴즈 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            퀴즈 목록 ({filteredQuizzes.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* 카테고리와 상태 */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      {quiz.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${
                      quiz.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          활성
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          비활성
                        </>
                      )}
                    </span>
                  </div>
                  
                  {/* 질문 */}
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{quiz.question}</h4>
                  
                  {/* 선택지 */}
                  <div className="space-y-1 mb-3">
                    {quiz.options.map((option, index) => (
                      <div key={index} className={`text-sm ${
                        index === quiz.correctAnswer 
                          ? 'text-green-600 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {index + 1}. {option} 
                        {index === quiz.correctAnswer && (
                          <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            정답
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* 설명 */}
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {quiz.explanation}
                  </p>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => toggleQuizActive(quiz.id)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      quiz.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {quiz.isActive ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuiz(quiz)
                      setShowModal(true)
                    }}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
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
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 조건에 맞는 퀴즈가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 퀴즈 추가/편집 모달 */}
      <QuizModal
        quiz={editingQuiz}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingQuiz(null)
        }}
        onSave={handleSaveQuiz}
      />
    </div>
  )
}