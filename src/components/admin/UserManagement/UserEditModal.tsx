'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { User } from '@/types/auth'

interface UserEditModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userData: EditUserData) => Promise<void>
}

interface EditUserData {
  name: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  role: 'admin' | 'editor' | 'user'
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<EditUserData>({
    name: '',
    company: '',
    gender: 'none',
    birth_date: '',
    phone: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<EditUserData>>({})

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        company: user.company || '',
        gender: user.gender,
        birth_date: user.birth_date,
        phone: user.phone,
        role: user.role
      })
      setErrors({})
    }
  }, [user, isOpen])

  if (!isOpen || !user) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<EditUserData> = {}

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요'
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2글자 이상 입력해주세요'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요'
    } else if (!/^01[0-9]{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다'
    }

    if (!formData.birth_date) {
      newErrors.birth_date = '생년월일을 입력해주세요'
    }

    if (formData.company && formData.company.length > 100) {
      newErrors.company = '회사명은 100글자 이하로 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EditUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            사용자 정보 수정
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* 회사 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              회사/소속
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="회사명을 입력하세요"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.company}
              </p>
            )}
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성별 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="none">선택 안함</option>
            </select>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange('birth_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.birth_date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.birth_date}
              </p>
            )}
          </div>

          {/* 권한 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권한 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">일반 사용자</option>
              <option value="editor">편집자</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}