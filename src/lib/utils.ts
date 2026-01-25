import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 🚀 정규표현식 캐싱 (성능 최적화)
const REGEX_CACHE = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^01[0-9]-\d{3,4}-\d{4}$/,
  phoneNumbers: /\D/g,
  phoneFormat: /(\d{3})(\d{4})(\d{4})/,
  searchHighlight: new Map<string, RegExp>(), // 동적 검색어 캐싱
  registrationNumber: /^MH\d{4}-[A-Z0-9]{8,12}$/,
  hexColor: /^#[0-9A-F]{6}$/i
} as const

// 🚀 cn 함수 (기본 유틸리티)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🚀 숫자 포맷팅 (K+, K 형식)
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${Math.floor(num / 1000)}K+`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

// 🚀 안전한 숫자 변환
export function safeToNumber(value: unknown): number {
  if (typeof value === 'number') return Math.max(0, Math.floor(value))
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? 0 : Math.max(0, parsed)
  }
  return 0
}

// 🚀 날짜 포맷팅 (최적화된 버전)
const DATE_FORMATTERS = {
  short: new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }),
  long: new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }),
  datetime: new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
} as const

export function formatDate(
  date: Date | string,
  format: keyof typeof DATE_FORMATTERS = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return '유효하지 않은 날짜'

  return DATE_FORMATTERS[format].format(dateObj)
}

// 🚀 이메일 유효성 검사 (캐시된 정규표현식)
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  return REGEX_CACHE.email.test(email.trim())
}

// 🚀 전화번호 유효성 검사 (캐시된 정규표현식)
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  return REGEX_CACHE.phone.test(phone.trim())
}

// 🚀 전화번호 포맷팅 (최적화)
export function formatPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return phone

  const numbers = phone.replace(REGEX_CACHE.phoneNumbers, '')
  if (numbers.length === 11) {
    return numbers.replace(REGEX_CACHE.phoneFormat, '$1-$2-$3')
  }
  return phone
}

// 🚀 텍스트 말줄임 처리 (안전성 강화)
export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string' || maxLength <= 0) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 🚀 검색어 하이라이트 (정규표현식 캐싱)
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!text || !searchTerm || typeof text !== 'string' || typeof searchTerm !== 'string') {
    return text || ''
  }

  const trimmedTerm = searchTerm.trim()
  if (!trimmedTerm) return text

  // 캐시에서 정규표현식 가져오기
  let regex = REGEX_CACHE.searchHighlight.get(trimmedTerm)
  if (!regex) {
    // 특수문자 이스케이프 처리
    const escapedTerm = trimmedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    regex = new RegExp(`(${escapedTerm})`, 'gi')

    // 캐시 크기 제한 (메모리 누수 방지)
    if (REGEX_CACHE.searchHighlight.size > 50) {
      const firstKey = REGEX_CACHE.searchHighlight.keys().next().value
      if (firstKey) { // undefined 체크 추가
        REGEX_CACHE.searchHighlight.delete(firstKey)
      }
    }

    REGEX_CACHE.searchHighlight.set(trimmedTerm, regex)
  }

  return text.replace(regex, '<mark>$1</mark>')
}

// 🚀 배열 청크 분할 (제네릭 타입 안전성)
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!Array.isArray(array) || chunkSize <= 0) return []

  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// 🚀 성능 최적화된 깊은 복사 (structuredClone 사용)
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj

  // 최신 브라우저에서는 structuredClone 사용 (훨씬 빠름)
  if (typeof structuredClone !== 'undefined') {
    try {
      return structuredClone(obj)
    } catch (error) {
      // structuredClone 실패 시 fallback
      console.warn('structuredClone failed, falling back to JSON method:', error)
    }
  }

  // Fallback to JSON method (호환성)
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (error) {
    console.error('Deep clone failed:', error)
    return obj
  }
}

// 🚀 URL 쿼리 파라미터 파싱 (에러 처리 강화)
export function parseQueryParams(url: string): Record<string, string> {
  if (!url || typeof url !== 'string') return {}

  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })

    return params
  } catch (error) {
    console.warn('Failed to parse query params:', error)
    return {}
  }
}

// 🚀 메모리 누수 방지 디바운스 (cleanup 함수 반환)
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): [(...args: Parameters<T>) => void, () => void] {
  let timeout: NodeJS.Timeout | null = null

  const debouncedFunction = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, wait)
  }

  // 🚀 cleanup 함수 제공 (메모리 누수 방지)
  const cleanup = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return [debouncedFunction, cleanup]
}

// 🚀 메모리 누수 방지 스로틀 (cleanup 함수 반환)
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): [(...args: Parameters<T>) => void, () => void] {
  let inThrottle = false
  let timeout: NodeJS.Timeout | null = null

  const throttledFunction = (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      timeout = setTimeout(() => {
        inThrottle = false
        timeout = null
      }, limit)
    }
  }

  // 🚀 cleanup 함수 제공
  const cleanup = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    inThrottle = false
  }

  return [throttledFunction, cleanup]
}

// 🚀 동적 import로 Excel 파일 생성 (번들 크기 최적화)
export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1'
): Promise<void> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('데이터가 비어있습니다.')
  }

  try {
    // 🚀 동적 import로 XLSX 라이브러리 로드 (필요할 때만)
    const XLSX = await import('xlsx')

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

// 🚀 최적화된 CSV 파일 생성 (메모리 효율적)
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('데이터가 비어있습니다.')
  }

  try {
    // 헤더 생성
    const headers = Object.keys(data[0])

    // 🚀 메모리 효율적인 CSV 생성 (대용량 데이터 대응)
    const csvRows: string[] = [headers.join(',')]

    for (const row of data) {
      const csvRow = headers.map(header => {
        const value = row[header]
        const stringValue = value?.toString() || ''

        // 쉼표나 따옴표가 포함된 경우 처리
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')

      csvRows.push(csvRow)
    }

    // BOM 추가 (한글 깨짐 방지)
    const BOM = '\uFEFF'
    const csvContent = csvRows.join('\n')
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })

    // 다운로드 링크 생성 및 정리
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 🚀 메모리 정리
    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (error) {
    console.error('CSV 파일 생성 중 오류:', error)
    throw new Error('CSV 파일 생성에 실패했습니다.')
  }
}

// 🚀 색상 밝기 계산 (접근성, 성능 최적화)
const COLOR_CACHE = new Map<string, string>()

export function getContrastColor(hexColor: string): string {
  if (!hexColor || typeof hexColor !== 'string') return '#000000'

  // 캐시 확인
  if (COLOR_CACHE.has(hexColor)) {
    return COLOR_CACHE.get(hexColor)!
  }

  // hex 색상 유효성 검사
  if (!REGEX_CACHE.hexColor.test(hexColor)) {
    return '#000000'
  }

  // hex에서 # 제거
  const hex = hexColor.replace('#', '')

  // RGB 값으로 변환
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 밝기 계산 (0-255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // 결과 계산 및 캐싱
  const result = brightness > 128 ? '#000000' : '#ffffff'

  // 캐시 크기 제한 (메모리 누수 방지)
  if (COLOR_CACHE.size > 100) {
    const firstKey = COLOR_CACHE.keys().next().value
    if (firstKey) {  // ← undefined 체크 추가됨
      COLOR_CACHE.delete(firstKey)
    }
  }

  COLOR_CACHE.set(hexColor, result)
  return result
}

// 🚀 최적화된 랜덤 색상 생성
const HEX_CHARS = '0123456789ABCDEF' as const

export function generateRandomColor(): string {
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += HEX_CHARS[Math.floor(Math.random() * 16)]
  }
  return color
}

// 🚀 타입 안전한 localStorage 유틸리티
interface LocalStorageUtil {
  get<T>(key: string, defaultValue?: T): T
  set<T>(key: string, value: T): boolean
  remove(key: string): boolean
  clear(): boolean
  exists(key: string): boolean
}

export const localStorage: LocalStorageUtil = {
  get<T>(key: string, defaultValue: T = null as T): T {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`localStorage.get 오류 (${key}):`, error)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`localStorage.set 오류 (${key}):`, error)
      return false
    }
  },

  remove(key: string): boolean {
    if (typeof window === 'undefined') return false

    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`localStorage.remove 오류 (${key}):`, error)
      return false
    }
  },

  clear(): boolean {
    if (typeof window === 'undefined') return false

    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.warn('localStorage.clear 오류:', error)
      return false
    }
  },

  exists(key: string): boolean {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(key) !== null
  }
}

// 🚀 타입 안전한 API 응답 포맷터
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  code?: number
  timestamp: string
}

export function formatApiResponse<T>(
  data: T,
  message: string = '성공',
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}

export function formatApiError(
  error: string,
  code: number = 500,
  details?: any
): ApiResponse<never> {
  return {
    success: false,
    error,
    code,
    message: error,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  }
}

// 🚀 성능 최적화된 페이지네이션 계산
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPrevPage: boolean
  pageNumbers: number[]
}

export function calculatePagination(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
  maxPageNumbers: number = 5
): PaginationInfo {
  // 입력값 검증
  const safePage = Math.max(1, Math.floor(currentPage))
  const safeItemsPerPage = Math.max(1, Math.floor(itemsPerPage))
  const safeTotalItems = Math.max(0, Math.floor(totalItems))

  const totalPages = Math.ceil(safeTotalItems / safeItemsPerPage)
  const validCurrentPage = Math.min(safePage, totalPages || 1)

  const startIndex = (validCurrentPage - 1) * safeItemsPerPage
  const endIndex = Math.min(startIndex + safeItemsPerPage, safeTotalItems)

  // 페이지 번호 배열 생성 (표시할 페이지 번호들)
  const pageNumbers: number[] = []
  const halfRange = Math.floor(maxPageNumbers / 2)
  let startPage = Math.max(1, validCurrentPage - halfRange)
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)

  // 끝에서부터 조정
  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems: safeTotalItems,
    itemsPerPage: safeItemsPerPage,
    startIndex,
    endIndex,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
    pageNumbers
  }
}

// 🚀 타입 안전한 배열 정렬
export function sortBy<T, K extends keyof T>(
  array: T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  if (!Array.isArray(array)) return []

  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    // null/undefined 처리
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return direction === 'asc' ? -1 : 1
    if (bVal == null) return direction === 'asc' ? 1 : -1

    // 비교
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// 🚀 유틸리티 정리 함수 (메모리 누수 방지)
export function cleanupUtils(): void {
  REGEX_CACHE.searchHighlight.clear()
  COLOR_CACHE.clear()
  console.log('Utils caches cleared')
}

// 🚀 개발 환경에서 자동 정리 (메모리 관리)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 10분마다 캐시 정리
  setInterval(cleanupUtils, 10 * 60 * 1000)
}