// src/types/like-sync.ts

/**
 * 좋아요 동기화 작업 타입
 */
export interface LikeSyncOperation {
  type: 'like_toggle'
  userId: string
  commentId: string
  isLiked: boolean
  timestamp: number
}

/**
 * Redis 파이프라인 결과 타입
 */
export interface PipelineResult {
  result: any
  error: Error | null
}

/**
 * 좋아요 API 응답 타입
 */
export interface LikeToggleResponse {
  success: boolean
  isLiked: boolean
  likes: number
  fromCache?: boolean
  processingTime: number
  error?: string
}

/**
 * Redis 좋아요 상태 타입
 */
export interface RedisLikeState {
  isCurrentlyLiked: boolean
  currentLikes: number
  inCooldown: boolean
}

/**
 * 배치 처리 통계 타입
 */
export interface BatchSyncStats {
  processed: number
  success: number
  failed: number
  duration: number
}