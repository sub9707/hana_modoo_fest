'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Search, RefreshCw } from 'lucide-react'
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

  const ITEMS_PER_PAGE = 20

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
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRegistrations(currentPage, searchTerm)
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  // 엑셀 다운로드
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/registrations/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `사전접수목록_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('엑셀 다운로드에 실패했습니다.')
    }
  }

  // 참여자 타입 변환
  const getParticipantTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      citizen: '일반시민',
      'single-parent': '한부모가족',
      'self-help': '자조모임',
      volunteer: '자원봉사자',
      organization: '유관기관'
    }
    return types[type] || type
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 참여자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(totalCount || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">동반 참가자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((registrations || []).reduce((sum, reg) => sum + (reg.companions || 0), 0) || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 예상 참가자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {((totalCount || 0) + ((registrations || []).reduce((sum, reg) => sum + (reg.companions || 0), 0) || 0)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 액션 바 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="이름, 전화번호로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            variant="outline"
            className="w-35 h-10 flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          <Button
            onClick={() => fetchRegistrations(currentPage, searchTerm)}
            variant="outline"
            disabled={loading}
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
                <TableRow key={registration.id}>
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
                      {registration.status === 'confirmed' ? '확정' : '대기'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(registration.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(registration.id)}
                      disabled={deleting === registration.id}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) handlePageChange(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}