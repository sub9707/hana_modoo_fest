export interface WritingEntry {
  id: string
  topic: string
  title: string
  content: string
  likes_count: number
  is_featured: boolean | 0 | 1
  author_name: string
  created_at: string
  is_liked?: boolean | 0 | 1 | "0" | "1" // 🚀 MySQL에서 문자열로 올 수도 있음
  is_mine?: boolean
}

export interface WritingTopic {
  id: number
  title: string
  description: string
  deadline: string
  examples: string[]
  is_active: boolean
  participants: number
}

export interface CooldownData {
  canWrite: boolean
  remainingSeconds: number
  lastWritingTime?: string
}

export interface User {
  id: string
  name: string
  username: string
  role: string
}

export type TabType = 'topics' | 'write' | 'browse' | 'featured' | 'my'
export type SortType = 'latest' | 'popular' | 'oldest'

export interface WritingState {
  currentUser: User | null
  writingTopics: WritingTopic[]
  selectedTopic: WritingTopic | null
  writingTitle: string
  writingContent: string
  currentTab: TabType
  isSubmitted: boolean
  cooldown: CooldownData
  browseWritings: WritingEntry[]
  featuredWritings: WritingEntry[]
  myWritings: WritingEntry[]
  browseSort: SortType
  browseTopic: string
  featuredTopic: string
  browseHasMore: boolean
  myHasMore: boolean
  browsePage: number
  myPage: number
  totalWritings: number
  loading: boolean
}