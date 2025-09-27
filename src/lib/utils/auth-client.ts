// 클라이언트 사이드 인증
const AUTH_CACHE_KEY = 'auth-cache'
const AUTH_CACHE_TIMESTAMP_KEY = 'auth-cache-timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5분

export interface AuthCache {
  user: any | null
  timestamp: number
  isAuthenticated: boolean
}

// 쿠키에서 세션 토큰 확인
export function hasSessionToken(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('session-token=')
}

// 인증 상태 캐시 저장
export function setAuthCache(user: any | null): void {
  if (typeof window === 'undefined') return

  const cache: AuthCache = {
    user,
    timestamp: Date.now(),
    isAuthenticated: !!user
  }

  try {
    sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('Failed to cache auth state:', error)
  }
}

// 인증 상태 캐시 조회
export function getAuthCache(): AuthCache | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = sessionStorage.getItem(AUTH_CACHE_KEY)
    if (!cached) return null

    const cache: AuthCache = JSON.parse(cached)
    
    // 캐시 만료 확인
    if (Date.now() - cache.timestamp > CACHE_DURATION) {
      clearAuthCache()
      return null
    }

    // 세션 토큰과 캐시 상태 불일치 확인
    const hasToken = hasSessionToken()
    if (hasToken !== cache.isAuthenticated) {
      clearAuthCache()
      return null
    }

    return cache
  } catch (error) {
    console.warn('Failed to get auth cache:', error)
    clearAuthCache()
    return null
  }
}

// 인증 상태 캐시 삭제
export function clearAuthCache(): void {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(AUTH_CACHE_KEY)
  } catch (error) {
    console.warn('Failed to clear auth cache:', error)
  }
}

// 토큰 상태 변화 감지를 위한 옵저버
export class TokenObserver {
  private listeners: Set<() => void> = new Set()
  private lastTokenState: boolean | null = null
  private checkInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startObserving()
  }

  // 리스너 추가
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    
    // 언구독 함수 반환
    return () => {
      this.listeners.delete(listener)
    }
  }

  // 토큰 상태 감지 시작
  private startObserving(): void {
    if (typeof window === 'undefined') return

    // 초기 상태 설정
    this.lastTokenState = hasSessionToken()

    // 30초마다 토큰 상태 확인
    this.checkInterval = setInterval(() => {
      this.checkTokenState()
    }, 30000)

    // 페이지 포커스 시 즉시 확인
    window.addEventListener('focus', () => {
      this.checkTokenState()
    })

    // storage 이벤트 리스너 (다른 탭에서의 로그아웃 감지)
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event') {
        this.notifyListeners()
      }
    })
  }

  // 토큰 상태 확인 및 변화 알림
  private checkTokenState(): void {
    const currentTokenState = hasSessionToken()
    
    if (this.lastTokenState !== currentTokenState) {
      this.lastTokenState = currentTokenState
      
      // 토큰이 사라졌으면 캐시 클리어
      if (!currentTokenState) {
        clearAuthCache()
      }
      
      this.notifyListeners()
    }
  }

  // 모든 리스너에게 알림
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener()
      } catch (error) {
        console.error('Error in token observer listener:', error)
      }
    })
  }

  // 옵저버 정리
  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    
    this.listeners.clear()
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.checkTokenState)
      window.removeEventListener('storage', this.notifyListeners)
    }
  }
}

// 전역 토큰 옵저버 인스턴스
export const tokenObserver = new TokenObserver()

// 로그아웃 이벤트를 다른 탭에 알리는 함수
export function notifyLogout(): void {
  if (typeof window === 'undefined') return

  try {
    // localStorage에 이벤트 기록 (다른 탭에서 감지)
    localStorage.setItem('logout-event', Date.now().toString())
    localStorage.removeItem('logout-event')
    
    // 현재 탭의 캐시도 클리어
    clearAuthCache()
  } catch (error) {
    console.warn('Failed to notify logout:', error)
  }
}