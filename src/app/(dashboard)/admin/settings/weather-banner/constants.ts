import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react'

export interface WeatherBannerSettings {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  temperature: number
  airQuality: 'good' | 'normal' | 'bad' | 'very_bad'
  customMessage: string
}

export const weatherOptions = [
  { value: 'sunny', label: '맑음', icon: Sun, color: 'bg-yellow-500', emoji: '🌤️' },
  { value: 'cloudy', label: '흐림', icon: Cloud, color: 'bg-gray-500', emoji: '☁️' },
  { value: 'rainy', label: '비', icon: CloudRain, color: 'bg-blue-500', emoji: '🌧️' },
  { value: 'snowy', label: '눈', icon: CloudSnow, color: 'bg-cyan-500', emoji: '❄️' }
] as const

export const airQualityOptions = [
  { value: 'good', label: '좋음', color: 'bg-green-500' },
  { value: 'normal', label: '보통', color: 'bg-yellow-500' },
  { value: 'bad', label: '나쁨', color: 'bg-orange-500' },
  { value: 'very_bad', label: '매우나쁨', color: 'bg-red-500' }
] as const

export const weatherMessages: Record<string, string> = {
  sunny: '야외 행사로 편안한 복장을 권장합니다',
  cloudy: '날씨가 흐리니 가벼운 겉옷을 챙겨주세요',
  rainy: '우천이 예상되니 우산을 꼭 챙겨주세요',
  snowy: '눈이 예상되니 따뜻한 옷차림과 미끄럼 방지를 권장합니다'
}

export const defaultSettings: WeatherBannerSettings = {
  weather: 'sunny',
  temperature: 22,
  airQuality: 'normal',
  customMessage: '야외 행사로 편안한 복장을 권장합니다'
}
