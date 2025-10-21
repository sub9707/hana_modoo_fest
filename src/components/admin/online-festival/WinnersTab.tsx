// src/components/admin/online-festival/WinnersTab.tsx
'use client'

import { useState, useEffect } from 'react'
import { Download, Search, RefreshCw, Gift, Trophy, CheckCircle, Settings, Users, Award, XCircle } from 'lucide-react'
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
import { PrizeProbabilityManager } from './PrizeProbabilityManager'

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

interface RouletteStats {
  total_participations: number
  unique_participants: number
  total_winners: number
  prize_winners: number
  consolation_count: number
  daily_stats: Array<{
    participation_date: string
    participations: number
    winners: number
  }>
}

export function WinnersTab() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [prizeStats, setPrizeStats] = useState<PrizeStats | null>(null)
  const [rouletteStats, setRouletteStats] = useState<RouletteStats | null>(null)
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
      const data = await response.json()
      const dataArr = data.data as WinnerResponse

      setWinners(dataArr.items)
      setTotalCount(dataArr.total)
      setTotalPages(dataArr.totalPages)
      setCurrentPage(dataArr.page)
    } catch (error) {
      console.error('Failed to fetch winners:', error)
    } finally {
      setLoading(false)
    }
  }

  // 통계 조회
  const fetchPrizeStats = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/winners/stats')
      const data = await response.json()
      if (data.success) {
        setPrizeStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch prize stats:', error)
    }
  }

  // 룰렛 이벤트 참여 통계 조회
  const fetchRouletteStats = async () => {
    try {
      const response = await fetch('/api/admin/event/roulette/stats')
      const data = await response.json()
      if (data.success) {
        setRouletteStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch roulette stats:', error)
    }
  }

  // 수령 상태 토글
  const handleToggleClaimed = async (winnerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/online-festival/winners/${winnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_claimed: !currentStatus })
      })

      const data = await response.json()
      if (data.success) {
        await fetchWinners(currentPage, searchTerm, prizeFilter, claimFilter)
        await fetchPrizeStats()
      } else {
        alert(data.error || '상태 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to toggle claimed status:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 엑셀 다운로드
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/winners/export')
      
      if (!response.ok) throw new Error('다운로드 실패')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `랜덤이벤트_당첨자_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('엑셀 다운로드 중 오류가 발생했습니다.')
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchWinners(1, searchTerm, prizeFilter, claimFilter)
  }

  const handlePrizeFilter = (value: string) => {
    setPrizeFilter(value)
    setCurrentPage(1)
    fetchWinners(1, searchTerm, value, claimFilter)
  }

  const handleClaimFilter = (value: string) => {
    setClaimFilter(value)
    setCurrentPage(1)
    fetchWinners(1, searchTerm, prizeFilter, value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchWinners(page, searchTerm, prizeFilter, claimFilter)
  }

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

  useEffect(() => {
    fetchWinners()
    fetchPrizeStats()
    fetchRouletteStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* 룰렛 이벤트 참여 통계 카드 (신규 추가) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              총 참여 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rouletteStats?.total_participations?.toLocaleString() || 0}회
            </div>
            <p className="text-xs text-gray-500 mt-1">
              고유 참여자: {rouletteStats?.unique_participants?.toLocaleString() || 0}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Award className="w-4 h-4 mr-2 text-green-600" />
              당첨자 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rouletteStats?.prize_winners?.toLocaleString() || 0}명
            </div>
            <p className="text-xs text-gray-500 mt-1">
              상품 당첨자 (꽝 제외)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <XCircle className="w-4 h-4 mr-2 text-orange-600" />
              꽝 당첨자 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rouletteStats?.consolation_count?.toLocaleString() || 0}명
            </div>
            <p className="text-xs text-gray-500 mt-1">
              꽝 또는 미당첨
            </p>
          </CardContent>
        </Card>
      </div>

      
      {/* 상품별 당첨 통계 카드 */}
      {prizeStats?.prize_breakdown && prizeStats.prize_breakdown.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">상품별 당첨 통계</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {prizeStats.prize_breakdown.map((prize, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{prize.prize_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900">{prize.count}명</div>
                  <p className="text-xs text-gray-500 mt-1">
                    총 {(prize.count * prize.value).toLocaleString()}원
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 기존 통계 카드 */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
          </CardContent>
        </Card>
      </div> */}

      {/* 상품 확률 설정 */}
      <PrizeProbabilityManager onUpdate={() => {
        fetchPrizeStats()
        fetchRouletteStats()
      }} />


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
              fetchRouletteStats()
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  )
}