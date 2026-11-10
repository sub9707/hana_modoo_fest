'use client'

import { useState, useEffect } from 'react'

interface WeatherSettings {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  temperature: number
  airQuality: 'good' | 'normal' | 'bad' | 'very_bad'
  customMessage: string
}

const weatherEmojis: Record<string, string> = {
  sunny: '🌤️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️'
}

const weatherLabels: Record<string, string> = {
  sunny: '맑음',
  cloudy: '흐림',
  rainy: '비',
  snowy: '눈'
}

const airQualityLabels: Record<string, string> = {
  good: '좋음',
  normal: '보통',
  bad: '나쁨',
  very_bad: '매우나쁨'
}

const DEFAULT_MESSAGE = '야외 행사로 편안한 복장을 권장합니다'

export default function WeatherNotice() {
  const [isVisible, setIsVisible] = useState(true)
  const [settings, setSettings] = useState<WeatherSettings>({
    weather: 'sunny',
    temperature: 22,
    airQuality: 'normal',
    customMessage: DEFAULT_MESSAGE
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeatherSettings()
  }, [])

  const fetchWeatherSettings = async () => {
    try {
      const response = await fetch('/api/public/weather-banner')
      const result = await response.json()

      if (result.success && result.data) {
        const newSettings = {
          weather: result.data.weather || 'sunny',
          temperature: result.data.temperature || 22,
          airQuality: result.data.airQuality || 'normal',
          customMessage: result.data.customMessage || DEFAULT_MESSAGE
        }

        setSettings(newSettings)
      }
    } catch (error) {
      console.error('날씨 설정 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible || loading) return null

  const weatherEmoji = weatherEmojis[settings.weather] || '🌤️'
  const weatherLabel = weatherLabels[settings.weather] || '맑음'
  const airQualityLabel = airQualityLabels[settings.airQuality] || '보통'
  const displayMessage = settings.customMessage || DEFAULT_MESSAGE

  return (
    <div className="bg-yellow-400 text-yellow-900 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 모바일 레이아웃 */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-lg">{weatherEmoji}</span>
              <span className="font-medium text-sm truncate">
                {weatherLabel} {settings.temperature}°C | 미세먼지 {airQualityLabel} | {displayMessage}
              </span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-yellow-900 hover:text-yellow-700 font-bold text-xl flex-shrink-0"
              aria-label="공지 닫기"
            >
              ×
            </button>
          </div>
        </div>

        {/* 데스크톱 레이아웃 */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{weatherEmoji}</span>
            <span className="font-medium">
              행사 당일 날씨: {weatherLabel}, 기온 {settings.temperature}°C | 미세먼지: {airQualityLabel} | 
              <span className="ml-2 font-bold">{displayMessage}</span>
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-900 hover:text-yellow-700 font-bold text-xl"
            aria-label="공지 닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}