// types/event.ts

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

export interface PrizeProbability {
  id: number
  prize_id: number
  probability: number
  min_probability: number
  max_probability: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PrizeWithProbability extends Prize {
  probability: number
}

export interface EventParticipation {
  id: string
  user_id: string
  participated_at: string
  participation_date: string
  ip_address: string | null
  user_agent: string | null
}

export interface EventWinner {
  id: string
  participation_id: string
  user_id: string
  prize_id: number
  won_at: string
  is_claimed: boolean
  claimed_at: string | null
  notes: string | null
}

export interface EventWinnerWithDetails extends EventWinner {
  user_name: string
  prize_name: string
  prize_icon: string
  prize_color: string
  masked_name: string
}

export interface RouletteResult {
  success: boolean
  prize?: PrizeWithProbability
  participation_id?: string
  winner_id?: string
  error?: string
  remaining_quantity?: number
}

export interface RouletteState {
  isSpinning: boolean
  canParticipate: boolean
  hasParticipatedToday: boolean
  currentRotation: number
  result: RouletteResult | null
  isLoading: boolean
  error: string | null
}

export interface EventStats {
  total_participants: number
  total_winners: number
  remaining_prizes: number
  event_active: boolean
}

export interface RecentWinner {
  id: string
  masked_name: string
  prize_name: string
  prize_icon: string
  prize_color: string
  won_at: string
  time_ago: string
}

export interface EventSettings {
  daily_participation_limit: number
  event_active: boolean
  max_concurrent_spins: number
  roulette_animation_duration: number
}

export interface SpinRequest {
  user_id: string
  ip_address?: string
  user_agent?: string
}

export interface SpinResponse {
  success: boolean
  data?: {
    prize: PrizeWithProbability
    participation_id: string
    winner_id?: string
    remaining_quantity: number
  }
  error?: string
  message?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}