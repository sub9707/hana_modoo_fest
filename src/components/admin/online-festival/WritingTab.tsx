'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'
import { Trash2, Search, FileDown, Eye, XCircle } from 'lucide-react'

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

export default function WritingTab() {
  const [writings, setWritings] = useState<Writing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [totalCount, setTotalCount] = useState(0)
  const [featuredCount, setFeaturedCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 데이터 조회
  const fetchWritings = async (page = currentPage, search = searchTerm, topic = topicFilter) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(topic !== 'all' && { topic })
      })

      const response = await fetch(`/api/admin/online-festival/writings?${params}`)
      const data = await response.json()
      const dataArr = data.data as WritingResponse

      setWritings(dataArr.items)
      setTotalCount(dataArr.total)
      setTotalPages(dataArr.totalPages)
      setCurrentPage(dataArr.page)

      // 우수작품 수 계산 (각 주제별 좋아요 상위 10개, 좋아요 1개 이상)
      // 서버에서 계산된 is_featured 값을 사용
      setFeaturedCount((dataArr.items || []).filter(w => w.is_featured).length)
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
            <div className="text-2xl font-bold text-orange-600">{(totalCount || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">우수작품</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{(featuredCount || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              각 주제별 좋아요 상위 10개 (자동 선정)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {writings.reduce((sum, w) => sum + w.likes_count, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 좋아요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalCount > 0
                ? (writings.reduce((sum, w) => sum + w.likes_count, 0) / totalCount).toFixed(1)
                : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="제목, 내용, 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
            <div className="flex gap-2">
              <select
                value={topicFilter}
                onChange={(e) => handleTopicFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">전체 주제</option>
                <option value="가족에게 전하고 싶은 말">전하고 싶은 말</option>
                <option value="가족과 함께해서 즐거웠던 순간">즐거웠던 순간</option>
              </select>
              <Button onClick={handleExportExcel} variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                엑셀 다운로드
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <p className="text-sm text-orange-700">
            <strong>우수작품 자동 선정:</strong> 각 주제별로 좋아요를 1개 이상 받은 작품 중 상위 10개가 자동으로 우수작품으로 선정됩니다.
          </p>
        </CardContent>
      </Card>

      {/* 작품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>작품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">주제</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">좋아요</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">우수작품</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {writings.map((writing) => (
                      <tr key={writing.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{writing.name}</td>
                        <td className="px-4 py-3 text-sm">{writing.phone}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {getTopicLabel(writing.topic)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">
                          {writing.title}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-semibold text-gray-900">{writing.likes_count}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {writing.is_featured ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              우수작품
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(writing.created_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleViewWriting(writing)}
                              variant="ghost"
                              size="sm"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(writing.id)}
                              variant="ghost"
                              size="sm"
                              disabled={deleting === writing.id}
                            >
                              {deleting === writing.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  이전
                </Button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  다음
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 상세보기 모달 */}
      {showModal && selectedWriting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedWriting.title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>작성자: {selectedWriting.name}</span>
                  <span>전화번호: {selectedWriting.phone}</span>
                  <span>좋아요: {selectedWriting.likes_count}</span>
                </div>
                
                <div>
                  <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                    {getTopicLabel(selectedWriting.topic)}
                  </span>
                  {selectedWriting.is_featured && (
                    <span className="inline-block ml-2 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                      우수작품
                    </span>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedWriting.content}</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  작성일: {new Date(selectedWriting.created_at).toLocaleString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}