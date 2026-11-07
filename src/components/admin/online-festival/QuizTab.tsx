'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Search, RefreshCw, Trophy } from 'lucide-react'
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

interface QuizParticipant {
  id: string
  user_id: string
  name: string
  phone: string
  quiz_version: string
  perfect_score: boolean
  total_questions: number
  correct_answers: number
  completion_time: number
  participated_at: string
}

interface QuizParticipantResponse {
  items: QuizParticipant[]
  total: number
  page: number
  totalPages: number
}

export function QuizTab() {
  const [participants, setParticipants] = useState<QuizParticipant[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const ITEMS_PER_PAGE = 20

  // 데이터 조회
  const fetchParticipants = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/online-festival/quiz-participants?${params}`)
      const data = await response.json()
      const dataArr = data.data as QuizParticipantResponse

      setParticipants(dataArr.items)
      setTotalCount(dataArr.total)
      setTotalPages(dataArr.totalPages)
      setCurrentPage(dataArr.page)

    } catch (error) {
      console.error('Failed to fetch quiz participants:', error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchParticipants()
  }, [])

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1)
    fetchParticipants(1, searchTerm)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchParticipants(page, searchTerm)
  }

  // 삭제 처리
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/online-festival/quiz-participants/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchParticipants(currentPage, searchTerm)
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
      const response = await fetch('/api/admin/online-festival/quiz-participants/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `퀴즈참여자목록_${new Date().toISOString().split('T')[0]}.xlsx`
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

  // 완료 시간 포맷팅
  const formatCompletionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}분 ${remainingSeconds}초`
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 참여자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{(totalCount || 0).toLocaleString()}</div>
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
            onClick={() => fetchParticipants(currentPage, searchTerm)}
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
              <TableHead>참가자</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>완료시간</TableHead>
              <TableHead>참여일시</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : (participants || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              (participants || []).map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {participant.name}
                    </div>
                  </TableCell>
                  <TableCell>{participant.phone}</TableCell>
                  <TableCell>
                    {formatCompletionTime(participant.completion_time)}
                  </TableCell>
                  <TableCell>
                    {new Date(participant.participated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(participant.id)}
                      disabled={deleting === participant.id}
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