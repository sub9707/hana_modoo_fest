export interface CoreValue {
  title: string
  subtitle: string
  description: string
}

export interface MainProgram {
  category: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'indigo' | 'red'
}

export interface ParticipationTarget {
  name: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'indigo' | 'red'
}

export interface BasicInfo {
  date: string
  time: string
  location: string
  organizer: string
  host: string
}

export interface OnlineCampaign {
  period: string
  description: string
}

export interface FestivalData {
  name: string
  year: string
  slogan: string
  englishName: string
  date: string
  time: string
  location: string
  organizer: string
  host: string
  purpose: string
  significance: string
  coreValues: CoreValue[]
  mainPrograms: MainProgram[]
  targets: ParticipationTarget[]
  onlineCampaign: OnlineCampaign
}

export type ColorTheme = 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'indigo' | 'red'