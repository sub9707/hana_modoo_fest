'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Search, RefreshCw, Eye } from 'lucide-react'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Badge } from '@/components/admin/online-festival/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/admin/online-festival/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/admin/online-festival/ui/pagination'
import { RegistrationDetailModal } from './RegistrationDetailModal'

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

interface RegistrationResponse {
  items: Registration[]
  total: number
  page: number
  totalPages: number
}

export function RegistrationTab() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // 모달 상태
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const ITEMS_PER_PAGE = 20

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

  // 데이터 조회
  const fetchRegistrations = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/online-festival/registrations?${params}`)
      const data = await response.json()
      const dataArr = data.data as RegistrationResponse

      setRegistrations(dataArr.items)
      setTotalCount(dataArr.total)
      setTotalPages(dataArr.totalPages)
      setCurrentPage(dataArr.page)
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchRegistrations()
  }, [])

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1)
    fetchRegistrations(1, searchTerm)
  }

  // 엔터키 검색 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchRegistrations(page, searchTerm)
  }

  // 삭제 처리
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/online-festival/registrations/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '삭제에 실패했습니다.')
      }

      alert(result.message)
      fetchRegistrations(currentPage, searchTerm)
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  // 엑셀 다운로드
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/registrations/export')

      if (!response.ok) {
        throw new Error('엑셀 다운로드에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `사전참가신청_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('엑셀 다운로드 중 오류가 발생했습니다.')
    }
  }

  // 상세 정보 보기
  const handleViewDetail = (registration: Registration) => {
    setSelectedRegistration(registration)
    setShowDetailModal(true)
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedRegistration(null)
  }

  // 페이지네이션 범위 계산
  const renderPaginationItems = () => {
    const items: React.ReactNode[] = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return items
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 신청자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCount.toLocaleString()}명</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">총 참가예정인원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {registrations.reduce((sum, r) => sum + r.companions + 1, 0).toLocaleString()}명
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 액션 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="이름 또는 전화번호로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-64"
          />
          <Button className="w-35 h-10 flex items-center" variant='outline' onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          <Button
            onClick={() => fetchRegistrations(currentPage, searchTerm)}
            variant="outline"
            className="w-50 h-10 flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>

        <Button
          onClick={handleExportExcel}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          엑셀 다운로드
        </Button>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>신청번호</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>참여유형</TableHead>
              <TableHead>동반자수</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : (registrations || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              (registrations || []).map((registration) => (
                <TableRow
                  key={registration.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDetail(registration)}
                >
                  <TableCell className="font-mono text-sm">
                    {registration.registration_number}
                  </TableCell>
                  <TableCell className="font-medium">
                    {registration.name}
                  </TableCell>
                  <TableCell>{registration.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getParticipantTypeLabel(registration.participant_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{registration.companions}명</TableCell>
                  <TableCell>
                    <Badge
                      variant={registration.status === 'confirmed' ? 'default' : 'destructive'}
                    >
                      {registration.status === 'confirmed' ? '확정' :
                        registration.status === 'pending' ? '대기' : '취소'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(registration.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetail(registration)
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(registration.id)
                        }}
                        disabled={deleting === registration.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* 디테일 모달 */}
      <RegistrationDetailModal
        registration={selectedRegistration}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}