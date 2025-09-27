export interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
  content: string
  contentType: 'text' | 'html' | 'markdown'
  views: number
  important: boolean
  createdAt?: string
  updatedAt?: string
  attachments?: NewsAttachment[]
  editorImages?: NewsEditorImage[]
}

export interface NewsAttachment {
  id: string
  newsId: string
  originalFilename: string
  storedFilename: string
  filePath: string
  fileSize: number
  mimeType: string
  fileExtension?: string
  displayOrder: number
  createdAt: string
}

export interface NewsEditorImage {
  id: string
  newsId: string
  originalFilename: string
  storedFilename: string
  filePath: string
  fileSize: number
  width?: number
  height?: number
  altText?: string
  createdAt: string
}

export interface NewsListResponse {
  news: NewsItem[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

export interface NewsSearchParams {
  category?: string
  search?: string
  sort?: 'newest' | 'oldest' | 'views' | 'important'
  limit?: number
  cursor?: string
}

export interface NewsFormData {
  title: string;
  category: string;
  summary?: string;
  content: string;
  content_type: 'text' | 'html' | 'markdown';
  important: boolean;
}

export type NewsListParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  important?: boolean;
}