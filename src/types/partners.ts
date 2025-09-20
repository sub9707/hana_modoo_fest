export interface Partner {
  id: string
  name: string
  logo: string
  description: string
  website: string
  category: string
}

export interface PartnersData {
  organizers: Partner[]
  sponsors: Partner[]
  participants: Partner[]
}

export type PartnerCategory = '주최' | '주관' | '후원' | '협력' | '참여기관'| '운영법인'