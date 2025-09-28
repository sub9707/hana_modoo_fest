'use client'

import React from 'react'
import { User, Phone, MapPin, Users, MessageSquare, Calendar, Hash, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/online-festival/ui/dialog'
import { Badge } from '@/components/admin/online-festival/ui/badge'

interface Registration {
  id: string
  user_id: string
  name: string
  phone: string
  registration_number: string
  participant_type: string
  companions: number
  companion_details: string | null
  address: string
  address_detail: string | null
  zip_code: string
  special_requests: string | null
  marketing_consent: boolean
  privacy_consent: boolean
  status: string
  created_at: string
}

interface RegistrationDetailModalProps {
  registration: Registration | null
  isOpen: boolean
  onClose: () => void
}

// 참가자 유형 라벨 맵핑
const getParticipantTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'citizen': '일반시민',
    'single-parent': '한부모가족',
    'self-help': '자조모임',
    'volunteer': '자원봉사자',
    'organization': '유관기관'
  }
  return typeLabels[type] || type
}

// 상태 라벨 맵핑
const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'confirmed': '확정',
    'pending': '대기',
    'cancelled': '취소'
  }
  return statusLabels[status] || status
}

// 상태별 색상 맵핑
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export function RegistrationDetailModal({ registration, isOpen, onClose }: RegistrationDetailModalProps) {
  if (!registration) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            사전참가신청 상세정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              기본 정보
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">신청번호</label>
                <div className="flex items-center text-gray-900">
                  <Hash className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-mono text-sm">{registration.registration_number}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">신청상태</label>
                <Badge className={getStatusColor(registration.status)}>
                  {getStatusLabel(registration.status)}
                </Badge>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">성명</label>
                <div className="flex items-center text-gray-900">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {registration.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">연락처</label>
                <div className="flex items-center text-gray-900">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {registration.phone}
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">참가자 유형</label>
                <Badge variant="outline">
                  {getParticipantTypeLabel(registration.participant_type)}
                </Badge>
              </div>
            </div>
          </div>

          {/* 동반자 정보 섹션 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              동반자 정보
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">동반자 수</label>
                <div className="text-gray-900 font-semibold">
                  {registration.companions}명 (본인 포함 총 {registration.companions + 1}명)
                </div>
              </div>
              
              {registration.companion_details && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">동반자 상세정보</label>
                  <div className="bg-white rounded-md p-3 border text-gray-900 whitespace-pre-wrap">
                    {registration.companion_details}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 주소 정보 섹션 */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              경품 수령 주소
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">우편번호</label>
                <div className="text-gray-900 font-mono">
                  {registration.zip_code}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">기본주소</label>
                <div className="text-gray-900">
                  {registration.address}
                </div>
              </div>
              
              {registration.address_detail && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">상세주소</label>
                  <div className="text-gray-900">
                    {registration.address_detail}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 특별 요청사항 섹션 */}
          {registration.special_requests && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                특별 요청사항
              </h3>
              
              <div className="bg-white rounded-md p-3 border text-gray-900 whitespace-pre-wrap">
                {registration.special_requests}
              </div>
            </div>
          )}

          {/* 개인정보 동의 섹션 */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              개인정보 동의 현황
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">개인정보 수집 동의</span>
                <div className="flex items-center">
                  {registration.privacy_consent ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${
                    registration.privacy_consent ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {registration.privacy_consent ? '동의' : '비동의'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">마케팅 수신 동의</span>
                <div className="flex items-center">
                  {registration.marketing_consent ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${
                    registration.marketing_consent ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {registration.marketing_consent ? '동의' : '비동의'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 신청 일시 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              신청 일시
            </h3>
            
            <div className="text-gray-900">
              {new Date(registration.created_at).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}