// lib/utils.ts
import * as XLSX from 'xlsx'

// Tailwind CSS 클래스 병합 유틸리티
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// 날짜 포맷팅 함수
export function formatDate(date: string | Date, format: 'short' | 'long' | 'datetime' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : '2-digit',
    day: '2-digit'
  }
  
  if (format === 'datetime') {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return new Intl.DateTimeFormat('ko-KR', options).format(dateObj)
}

// 상대 시간 포맷팅 (예: "2시간 전", "3일 전")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  
  return `${Math.floor(diffInSeconds / 31536000)}년 전`
}

// 숫자 포맷팅 (천 단위 콤마)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

// 백분율 계산
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 이메일 유효성 검사
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 전화번호 유효성 검사 (한국 형식)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/
  return phoneRegex.test(phone)
}

// 전화번호 포맷팅 (010-1234-5678)
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  return phone
}

// 텍스트 말줄임 처리
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 검색어 하이라이트
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 배열을 청크 단위로 나누기
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// 객체 깊은 복사
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// URL에서 쿼리 파라미터 파싱
export function parseQueryParams(url: string): Record<string, string> {
  const urlObj = new URL(url)
  const params: Record<string, string> = {}
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

// 디바운스 함수
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 스로틀 함수
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Excel 파일 생성 및 다운로드
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  try {
    // 워크북 생성
    const workbook = XLSX.utils.book_new()
    
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // 파일 다운로드
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  } catch (error) {
    console.error('Excel 파일 생성 중 오류:', error)
    throw new Error('Excel 파일 생성에 실패했습니다.')
  }
}

// CSV 파일 생성 및 다운로드
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  try {
    if (data.length === 0) return
    
    // 헤더 생성
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // 쉼표나 따옴표가 포함된 경우 따옴표로 감싸기
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')
    
    // BOM 추가 (한글 깨짐 방지)
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    
    // 다운로드 링크 생성
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('CSV 파일 생성 중 오류:', error)
    throw new Error('CSV 파일 생성에 실패했습니다.')
  }
}

// 색상 밝기 계산 (접근성용)
export function getContrastColor(hexColor: string): string {
  // hex 색상에서 # 제거
  const hex = hexColor.replace('#', '')
  
  // RGB 값으로 변환
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // 밝기 계산 (0-255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // 밝기에 따라 검은색 또는 흰색 반환
  return brightness > 128 ? '#000000' : '#ffffff'
}

// 랜덤 색상 생성
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 로컬 스토리지 유틸리티 (에러 처리 포함)
export const localStorage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`로컬 스토리지에서 ${key}를 가져오는 중 오류:`, error)
      return defaultValue
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`로컬 스토리지에 ${key}를 저장하는 중 오류:`, error)
    }
  },
  
  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`로컬 스토리지에서 ${key}를 삭제하는 중 오류:`, error)
    }
  }
}

// API 응답 포맷터
export function formatApiResponse<T>(
  data: T,
  message: string = '성공',
  success: boolean = true
) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}

// API 에러 포맷터
export function formatApiError(
  error: string,
  code: number = 500,
  details?: any
) {
  return {
    success: false,
    error,
    code,
    details,
    timestamp: new Date().toISOString()
  }
}

// 페이지네이션 계산
export function calculatePagination(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
}

// 정렬 함수
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}