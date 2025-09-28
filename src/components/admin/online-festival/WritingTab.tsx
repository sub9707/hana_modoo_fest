'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Search, RefreshCw, Eye, Star } from 'lucide-react'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Badge } from '@/components/admin/online-festival/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/admin/online-festival/ui/dialog'
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

interface Writing {
    id: string
    user_id: string
    name: string
    phone: string
    topic: string
    title: string
    content: string
    likes_count: number
    is_featured: boolean
    created_at: string
}

interface WritingResponse {
    items: Writing[]
    total: number
    page: number
    totalPages: number
}

export function WritingsTab() {
    const [writings, setWritings] = useState<Writing[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [featuredCount, setFeaturedCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [topicFilter, setTopicFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    // 모달 상태
    const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null)
    const [showModal, setShowModal] = useState(false)

    const ITEMS_PER_PAGE = 20

    // 데이터 조회
    const fetchWritings = async (page = 1, search = '', topic = 'all') => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                ...(search && { search }),
                ...(topic !== 'all' && { topic })
            })

            const response = await fetch(`/api/admin/online-festival/writings?${params}`)
            const data: WritingResponse = await response.json()

            setWritings(data.items)
            setTotalCount(data.total)
            setTotalPages(data.totalPages)
            setCurrentPage(data.page)

            // 우수작품 수 계산
            setFeaturedCount((data.items || []).filter(w => w.is_featured).length)
        } catch (error) {
            console.error('Failed to fetch writings:', error)
        } finally {
            setLoading(false)
        }
    }

    // 초기 데이터 로드
    useEffect(() => {
        fetchWritings()
    }, [])

    // 검색 처리
    const handleSearch = () => {
        setCurrentPage(1)
        fetchWritings(1, searchTerm, topicFilter)
    }

    // 필터 변경
    const handleTopicFilter = (topic: string) => {
        setTopicFilter(topic)
        setCurrentPage(1)
        fetchWritings(1, searchTerm, topic)
    }

    // 페이지 변경
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchWritings(page, searchTerm, topicFilter)
    }

    // 삭제 처리
    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        setDeleting(id)
        try {
            const response = await fetch(`/api/admin/online-festival/writings/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchWritings(currentPage, searchTerm, topicFilter)
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

    // 우수작품 토글
    const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
        try {
            const response = await fetch(`/api/admin/online-festival/writings/${id}/featured`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: !isFeatured })
            })

            if (response.ok) {
                fetchWritings(currentPage, searchTerm, topicFilter)
            } else {
                alert('우수작품 설정에 실패했습니다.')
            }
        } catch (error) {
            console.error('Toggle featured failed:', error)
            alert('우수작품 설정 중 오류가 발생했습니다.')
        }
    }

    // 엑셀 다운로드
    const handleExportExcel = async () => {
        try {
            const response = await fetch('/api/admin/online-festival/writings/export')
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `가족글짓기목록_${new Date().toISOString().split('T')[0]}.xlsx`
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

    // 글 상세 보기
    const handleViewWriting = (writing: Writing) => {
        setSelectedWriting(writing)
        setShowModal(true)
    }

    // 주제 레이블 변환
    const getTopicLabel = (topic: string) => {
        return topic === '가족에게 전하고 싶은 말' ? '전하고 싶은 말' : '즐거웠던 순간'
    }

    return (
        <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">전체 작품 수</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{(totalCount || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">우수작품</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{(featuredCount || 0).toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            전체의 {totalCount > 0 ? Math.round(((featuredCount || 0) / totalCount) * 100) : 0}%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-pink-600">
                            {(writings || []).reduce((sum, w) => sum + (w.likes_count || 0), 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">평균 좋아요</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {(writings || []).length > 0
                                ? ((writings || []).reduce((sum, w) => sum + (w.likes_count || 0), 0) / (writings || []).length).toFixed(1)
                                : '0'
                            }

                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 검색 및 액션 바 */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="제목, 작성자로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Select value={topicFilter} onValueChange={handleTopicFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="주제 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 주제</SelectItem>
                            <SelectItem value="가족에게 전하고 싶은 말">전하고 싶은 말</SelectItem>
                            <SelectItem value="가족과 함께해서 즐거웠던 순간">즐거웠던 순간</SelectItem>
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
                        onClick={() => fetchWritings(currentPage, searchTerm, topicFilter)}
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
                            <TableHead>제목</TableHead>
                            <TableHead>작성자</TableHead>
                            <TableHead>전화번호</TableHead>
                            <TableHead>주제</TableHead>
                            <TableHead>좋아요</TableHead>
                            <TableHead>우수작품</TableHead>
                            <TableHead>작성일</TableHead>
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
                        ) : (writings || []).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            (writings || []).map((writing) => (
                                <TableRow key={writing.id}>
                                    <TableCell className="font-medium max-w-xs">
                                        <div className="truncate">{writing.title}</div>
                                    </TableCell>
                                    <TableCell>{writing.name}</TableCell>
                                    <TableCell>{writing.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getTopicLabel(writing.topic)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{writing.likes_count}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleToggleFeatured(writing.id, writing.is_featured)}
                                            size="sm"
                                            variant={writing.is_featured ? "default" : "outline"}
                                            className={writing.is_featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                        >
                                            <Star className={`h-4 w-4 ${writing.is_featured ? 'fill-current' : ''}`} />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(writing.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => handleViewWriting(writing)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(writing.id)}
                                                disabled={deleting === writing.id}
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700 text-white"
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

            {/* 글 상세 보기 모달 */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>{selectedWriting?.title}</span>
                            {selectedWriting?.is_featured && (
                                <Badge className="bg-yellow-500">우수작품</Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedWriting && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>작성자:</strong> {selectedWriting.name}
                                </div>
                                <div>
                                    <strong>연락처:</strong> {selectedWriting.phone}
                                </div>
                                <div>
                                    <strong>주제:</strong> {getTopicLabel(selectedWriting.topic)}
                                </div>
                                <div>
                                    <strong>좋아요:</strong> {selectedWriting.likes_count}개
                                </div>
                                <div>
                                    <strong>작성일:</strong> {new Date(selectedWriting.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">글 내용</h4>
                                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                    {selectedWriting.content}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}