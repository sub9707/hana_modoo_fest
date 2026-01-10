import { ApiResponse, PaginatedResponse, SearchParams } from "./common"

export interface Registration {
  id: string
  user_id: string
  name: string
  phone: string
  registration_number: string
  participant_type: 'citizen' | 'single-parent' | 'self-help' | 'volunteer' | 'organization'
  companions: number
  companion_details: string | null
  address: string
  address_detail: string | null
  zip_code: string
  special_requests: string | null
  marketing_consent: boolean
  privacy_consent: boolean
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
}

export interface QuizParticipant {
  id: string
  user_id: string
  name: string
  phone: string
  quiz_version: string
  perfect_score: boolean
  total_questions: number
  correct_answers: number
  completion_time: number
  ip_address: string | null
  participated_at: string
}

export interface CommentParticipant {
  user_id: string
  name: string
  phone: string
  comment_count: number
  latest_comment_at: string
}

export interface SupportComment {
  id: string
  user_id: string
  name: string
  phone: string
  message: string
  likes: number
  created_at: string
}

export interface Writing {
  id: string
  user_id: string
  name: string
  phone: string
  topic: '가족에게 전하고 싶은 말' | '가족과 함께해서 즐거웠던 순간'
  title: string
  content: string
  likes_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Winner {
  id: string
  user_id: string
  participation_id: string
  name: string
  phone: string
  prize_id: number
  prize_name: string
  prize_icon: string
  prize_color: string
  prize_value: number
  is_claimed: boolean
  won_at: string
  claimed_at: string | null
  notes: string | null
}

export interface Prize {
  id: number
  name: string
  description: string | null
  icon: string
  color: string
  type: 'giftcard' | 'none'
  value: number | null
  initial_quantity: number
  current_quantity: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface WinnerStats {
  total_winners: number
  claimed_count: number
  unclaimed_count: number
  total_value: number
  prize_breakdown: Array<{
    prize_name: string
    prize_icon: string
    prize_color: string
    count: number
    value: number
    total_value: number
  }>
}

export interface RegistrationSearchParams extends SearchParams {
  program?: string
}

export interface QuizSearchParams extends SearchParams {
  quiz_version?: string
  perfect_only?: boolean
}

export interface WritingSearchParams extends SearchParams {
  topic?: string
  featured?: boolean
}

export interface WinnerSearchParams extends SearchParams {
  prize?: string
  claimed?: boolean
}

export interface ExportRequest {
  filters?: Record<string, any>
  format?: 'xlsx' | 'csv'
}

export interface OnlineFestivalStats {
  registrations: {
    total: number
    confirmed: number
    pending: number
    companions: number
  }
  quiz: {
    total_participants: number
    perfect_score_count: number
    average_time: number
    fastest_time: number
  }
  comments: {
    total_participants: number
    total_comments: number
    total_likes: number
    average_per_participant: number
  }
  writings: {
    total: number
    featured: number
    total_likes: number
    average_likes: number
  }
  winners: {
    total: number
    claimed: number
    unclaimed: number
    total_value: number
  }
}