'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Search, RefreshCw, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Badge } from '@/components/admin/online-festival/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/online-festival/ui/tabs'
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

interface CommentParticipant {
  user_id: string
  name: string
  phone: string
  comment_count: number
  latest_comment_at: string
}

interface SupportComment {
  id: string
  user_id: string
  name: string
  phone: string
  message: string
  likes: number
  created_at: string
}

interface ParticipantResponse {
  items: CommentParticipant[]
  total: number
  page: number
  totalPages: number
}

interface CommentResponse {
  items: SupportComment[]
  total: number
  page: number
  totalPages: number
}

export function SupportCommentsTab() {
  const [activeSubTab, setActiveSubTab] = useState('participants')
  
  // 참여자 관련 상태
  const [participants, setParticipants] = useState<CommentParticipant[]>([])
  const [participantTotal, setParticipantTotal] = useState(0)
  const [participantPage, setParticipantPage] = useState(1)
  const [participantTotalPages, setParticipantTotalPages] = useState(1)
  const [participantSearch, setParticipantSearch] = useState('')

  // 댓글 관련 상태
  const [comments, setComments] = useState<SupportComment[]>([])
  const [commentTotal, setCommentTotal] = useState(0)
  const [commentPage, setCommentPage] = useState(1)
  const [commentTotalPages, setCommentTotalPages] = useState(1)
  const [commentSearch, setCommentSearch] = useState('')

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const ITEMS_PER_PAGE = 20

  // 참여자 데이터 조회
  const fetchParticipants = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/online-festival/support-comments/participants?${params}`)
      const data: ParticipantResponse = await response.json()

      setParticipants(data.items)
      setParticipantTotal(data.total)
      setParticipantTotalPages(data.totalPages)
      setParticipantPage(data.page)
    } catch (error) {
      console.error('Failed to fetch participants:', error)
    } finally {
      setLoading(false)
    }
  }

  // 댓글 데이터 조회
  const fetchComments = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/online-festival/support-comments?${params}`)
      const data: CommentResponse = await response.json()

      setComments(data.items)
      setCommentTotal(data.total)
      setCommentTotalPages(data.totalPages)
      setCommentPage(data.page)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    if (activeSubTab === 'participants') {
      fetchParticipants()
    } else {
      fetchComments()
    }
  }, [activeSubTab])

  // 댓글 삭제
  const handleDeleteComment = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/online-festival/support-comments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchComments(commentPage, commentSearch)
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

  // 참여자 엑셀 다운로드
  const handleExportParticipants = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/support-comments/participants/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `응원댓글참여자목록_${new Date().toISOString().split('T')[0]}.xlsx`
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

  // 댓글 엑셀 다운로드
  const handleExportComments = async () => {
    try {
      const response = await fetch('/api/admin/online-festival/support-comments/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `응원댓글목록_${new Date().toISOString().split('T')[0]}.xlsx`
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 참여자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(participantTotal || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">중복 제거된 인원</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 댓글 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(commentTotal || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 댓글 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {participantTotal > 0 ? ((commentTotal || 0) / participantTotal).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">참여자당 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* 서브 탭 */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="participants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            참여자 관리
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            댓글 관리
          </TabsTrigger>
        </TabsList>

        {/* 참여자 관리 탭 */}
        <TabsContent value="participants" className="space-y-4">
          {/* 검색 및 액션 바 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="이름, 전화번호로 검색..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-64"
                onKeyPress={(e) => e.key === 'Enter' && fetchParticipants(1, participantSearch)}
              />
              <Button 
                onClick={() => fetchParticipants(1, participantSearch)}
                variant="outline"
                className="w-35 h-10 flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button 
                onClick={() => fetchParticipants(participantPage, participantSearch)}
                variant="outline"
                disabled={loading}
                className="w-50 h-10 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>

            <Button 
              onClick={handleExportParticipants}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              참여자 엑셀 다운로드
            </Button>
          </div>

          {/* 참여자 테이블 */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>댓글 수</TableHead>
                  <TableHead>최근 댓글 일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      로딩 중...
                    </TableCell>
                  </TableRow>
                ) : (participants || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  (participants || []).map((participant) => (
                    <TableRow key={participant.user_id}>
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      <TableCell>{participant.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {participant.comment_count}개
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(participant.latest_comment_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* 참여자 페이지네이션 */}
          {participantTotalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (participantPage > 1) {
                        setParticipantPage(participantPage - 1)
                        fetchParticipants(participantPage - 1, participantSearch)
                      }
                    }}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, participantTotalPages) }, (_, i) => {
                  let pageNum
                  if (participantTotalPages <= 5) {
                    pageNum = i + 1
                  } else if (participantPage <= 3) {
                    pageNum = i + 1
                  } else if (participantPage >= participantTotalPages - 2) {
                    pageNum = participantTotalPages - 4 + i
                  } else {
                    pageNum = participantPage - 2 + i
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === participantPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setParticipantPage(pageNum)
                          fetchParticipants(pageNum, participantSearch)
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
                      if (participantPage < participantTotalPages) {
                        setParticipantPage(participantPage + 1)
                        fetchParticipants(participantPage + 1, participantSearch)
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>

        {/* 댓글 관리 탭 */}
        <TabsContent value="comments" className="space-y-4">
          {/* 검색 및 액션 바 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="이름, 댓글 내용으로 검색..."
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                className="w-64"
                onKeyPress={(e) => e.key === 'Enter' && fetchComments(1, commentSearch)}
              />
              <Button 
                onClick={() => fetchComments(1, commentSearch)}
                variant="outline"
                className="w-35 h-10 flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button 
                onClick={() => fetchComments(commentPage, commentSearch)}
                variant="outline"
                disabled={loading}
                className="w-50 h-10 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>

            <Button 
              onClick={handleExportComments}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              댓글 엑셀 다운로드
            </Button>
          </div>

          {/* 댓글 테이블 */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>작성자</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>댓글 내용</TableHead>
                  <TableHead>좋아요</TableHead>
                  <TableHead>작성일시</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      로딩 중...
                    </TableCell>
                  </TableRow>
                ) : (comments || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  (comments || []).map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="font-medium">{comment.name}</TableCell>
                      <TableCell>{comment.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {comment.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{comment.likes}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(comment.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleting === comment.id}
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

          {/* 댓글 페이지네이션 */}
          {commentTotalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (commentPage > 1) {
                        setCommentPage(commentPage - 1)
                        fetchComments(commentPage - 1, commentSearch)
                      }
                    }}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, commentTotalPages) }, (_, i) => {
                  let pageNum
                  if (commentTotalPages <= 5) {
                    pageNum = i + 1
                  } else if (commentPage <= 3) {
                    pageNum = i + 1
                  } else if (commentPage >= commentTotalPages - 2) {
                    pageNum = commentTotalPages - 4 + i
                  } else {
                    pageNum = commentPage - 2 + i
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === commentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setCommentPage(pageNum)
                          fetchComments(pageNum, commentSearch)
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
                      if (commentPage < commentTotalPages) {
                        setCommentPage(commentPage + 1)
                        fetchComments(commentPage + 1, commentSearch)
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}