'use client'

import { useState, useEffect } from 'react'
import { Download, Search, RefreshCw, Gift, Trophy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Badge } from '@/components/admin/online-festival/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/online-festival/ui/select'
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

interface Winner {
  id: string
  user_id: string
  name: string
  phone: string
  prize_name: string
  prize_icon: string
  prize_color: string
  prize_value: number
  is_claimed: boolean
  won_at: string
  claimed_at: string | null
  notes: string | null
}

interface WinnerResponse {
  items: Winner[]
  total: number
  page: number
  totalPages: number
}

interface PrizeStats {
  total_winners: number
  claimed_count: number
  unclaimed_count: number
  total_value: number
  prize_breakdown: Array<{
    prize_name: string
    count: number
    value: number
  }>
}

export function WinnersTab() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [prizeStats, setPrizeStats] = useState<PrizeStats | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [prizeFilter, setPrizeFilter] = useState('all')
  const [claimFilter, setClaimFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const ITEMS_PER_PAGE = 20

  // 데이터 조회
  const fetchWinners = async (page = 1, search = '', prize = 'all', claim = 'all') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search }),
        ...(prize !== 'all' && { prize }),
        ...(claim !== 'all' && { claimed: claim })
      })

      const response = await fetch(`/api/admin/online-festival/winners?${params}`)
      const data: WinnerResponse = await response.json()

      setWinners(data.items)
      setTotalCount(data.total)
      setTotalPages(data.totalPages)
      setCurrentPage(data.page)
    } catch (error) {
      console.error('Failed to fetch winners:', error)
    } finally {
      setLoading(false)
    }
  }

  // 통계 데이터 조회
  const fetchPrizeStats = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/winners/stats')
      const data: PrizeStats = await response.json()
      setPrizeStats(data)
    } catch (error) {
      console.error('Failed to fetch prize stats:', error)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchWinners()
    fetchPrizeStats()
  }, [])

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1)
    fetchWinners(1, searchTerm, prizeFilter, claimFilter)
  }

  // 필터 변경
  const handlePrizeFilter = (prize: string) => {
    setPrizeFilter(prize)
    setCurrentPage(1)
    fetchWinners(1, searchTerm, prize, claimFilter)
  }

  const handleClaimFilter = (claim: string) => {
    setClaimFilter(claim)
    setCurrentPage(1)
    fetchWinners(1, searchTerm, prizeFilter, claim)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchWinners(page, searchTerm, prizeFilter, claimFilter)
  }

  // 수령 상태 토글
  const handleToggleClaimed = async (winnerId: string, isClaimed: boolean) => {
    try {
      const response = await fetch(`/api/admin/online-festival/winners/${winnerId}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_claimed: !isClaimed })
      })

      if (response.ok) {
        fetchWinners(currentPage, searchTerm, prizeFilter, claimFilter)
        fetchPrizeStats()
      } else {
        alert('수령 상태 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('Toggle claim failed:', error)
      alert('수령 상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 엑셀 다운로드
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/winners/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `당첨자목록_${new Date().toISOString().split('T')[0]}.xlsx`
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

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 당첨자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {prizeStats?.total_winners?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">수령 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {prizeStats?.claimed_count?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              전체의 {prizeStats?.total_winners ? Math.round(((prizeStats.claimed_count || 0) / prizeStats.total_winners) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">수령 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {prizeStats?.unclaimed_count?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 상품 가치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {prizeStats?.total_value ? `${prizeStats.total_value.toLocaleString()}원` : '0원'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상품별 통계 카드 */}
      {prizeStats?.prize_breakdown && prizeStats.prize_breakdown.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {prizeStats.prize_breakdown.map((prize, index) => (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{prize.prize_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900">{prize.count}명</div>
                <p className="text-xs text-gray-500">
                  {prize.value ? `${prize.value.toLocaleString()}원` : '무료'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
          <Select value={prizeFilter} onValueChange={handlePrizeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상품 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상품</SelectItem>
              {(prizeStats?.prize_breakdown || []).map((prize, index) => (
                <SelectItem key={index} value={prize.prize_name}>
                  {prize.prize_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={claimFilter} onValueChange={handleClaimFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="수령 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">수령 완료</SelectItem>
              <SelectItem value="false">수령 대기</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSearch}
            variant="outline"
            className="w-35 h-10 flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          <Button 
            onClick={() => {
              fetchWinners(currentPage, searchTerm, prizeFilter, claimFilter)
              fetchPrizeStats()
            }}
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
              <TableHead>당첨자</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>상품 가치</TableHead>
              <TableHead>당첨일시</TableHead>
              <TableHead>수령 상태</TableHead>
              <TableHead>수령일시</TableHead>
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
            ) : (winners || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              (winners || []).map((winner) => (
                <TableRow key={winner.id}>
                  <TableCell className="font-medium">{winner.name}</TableCell>
                  <TableCell>{winner.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span style={{ color: winner.prize_color }}>
                        {winner.prize_icon}
                      </span>
                      {winner.prize_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {winner.prize_value > 0 ? `${winner.prize_value.toLocaleString()}원` : '무료'}
                  </TableCell>
                  <TableCell>
                    {new Date(winner.won_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={winner.is_claimed ? 'default' : 'secondary'}
                      className={winner.is_claimed ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}
                    >
                      {winner.is_claimed ? '수령 완료' : '수령 대기'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {winner.claimed_at ? new Date(winner.claimed_at).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleToggleClaimed(winner.id, winner.is_claimed)}
                      size="sm"
                      variant={winner.is_claimed ? "outline" : "default"}
                      className={!winner.is_claimed ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {winner.is_claimed ? '수령 취소' : '수령 완료'}
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