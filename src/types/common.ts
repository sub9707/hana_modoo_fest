export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  error?: string
}

export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  order?: "asc" | "desc"
}
