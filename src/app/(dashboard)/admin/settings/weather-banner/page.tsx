'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, CloudSnow, Sun, Save, Loader2, RotateCcw } from 'lucide-react'

interface WeatherBannerSettings {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  temperature: number
  airQuality: 'good' | 'normal' | 'bad' | 'very_bad'
  customMessage: string
}

const weatherOptions = [
  { value: 'sunny', label: '맑음', icon: Sun, color: 'bg-yellow-500', emoji: '🌤️' },
  { value: 'cloudy', label: '흐림', icon: Cloud, color: 'bg-gray-500', emoji: '☁️' },
  { value: 'rainy', label: '비', icon: CloudRain, color: 'bg-blue-500', emoji: '🌧️' },
  { value: 'snowy', label: '눈', icon: CloudSnow, color: 'bg-cyan-500', emoji: '❄️' }
]

const airQualityOptions = [
  { value: 'good', label: '좋음', color: 'bg-green-500' },
  { value: 'normal', label: '보통', color: 'bg-yellow-500' },
  { value: 'bad', label: '나쁨', color: 'bg-orange-500' },
  { value: 'very_bad', label: '매우나쁨', color: 'bg-red-500' }
]

const weatherMessages: Record<string, string> = {
  sunny: '야외 행사로 편안한 복장을 권장합니다',
  cloudy: '날씨가 흐리니 가벼운 겉옷을 챙겨주세요',
  rainy: '우천이 예상되니 우산을 꼭 챙겨주세요',
  snowy: '눈이 예상되니 따뜻한 옷차림과 미끄럼 방지를 권장합니다'
}

export default function WeatherBannerSettingsPage() {
  const [settings, setSettings] = useState<WeatherBannerSettings>({
    weather: 'sunny',
    temperature: 22,
    airQuality: 'normal',
    customMessage: '야외 행사로 편안한 복장을 권장합니다'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/weather-banner')
      const result = await response.json()
      
      if (result.success && result.data) {
        setSettings({
          weather: result.data.weather || 'sunny',
          temperature: result.data.temperature || 22,
          airQuality: result.data.airQuality || 'normal',
          customMessage: result.data.customMessage || '야외 행사로 편안한 복장을 권장합니다'
        })
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  const handleWeatherChange = (weather: string) => {
    setSettings({
      ...settings,
      weather: weather as any,
      customMessage: weatherMessages[weather]
    })
  }

  const resetToDefaultMessage = () => {
    setSettings({
      ...settings,
      customMessage: weatherMessages[settings.weather]
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/settings/weather-banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: '설정이 저장되었습니다.' })
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다.' })
      }
    } catch (error) {
      console.error('설정 저장 실패:', error)
      setMessage({ type: 'error', text: '서버 오류가 발생했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const selectedWeather = weatherOptions.find(w => w.value === settings.weather)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">날씨 배너 설정</h1>
        <p className="text-gray-600 mt-2">/directions 페이지 상단의 날씨 배너를 설정합니다</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            날씨 선택
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weatherOptions.map((option) => {
              const Icon = option.icon
              const isSelected = settings.weather === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleWeatherChange(option.value)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? `${option.color} text-white border-transparent shadow-lg scale-105` 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="font-medium">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            기온 설정 (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 22"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            미세먼지 농도
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {airQualityOptions.map((option) => {
              const isSelected = settings.airQuality === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => setSettings({ ...settings, airQuality: option.value as any })}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    isSelected 
                      ? `${option.color} text-white border-transparent shadow-lg scale-105` 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">
              안내 문구
            </label>
            <button
              onClick={resetToDefaultMessage}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              기본 문구로 되돌리기
            </button>
          </div>
          <input
            type="text"
            value={settings.customMessage || ''}
            onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="안내 문구를 입력하세요"
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-2">
            날씨 선택 시 자동으로 문구가 설정되며, 직접 수정할 수도 있습니다
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">미리보기</h4>
          <div className="flex items-center space-x-2 text-yellow-900">
            <span className="text-xl">{selectedWeather?.emoji}</span>
            <span className="font-medium">
              행사 당일 날씨: {selectedWeather?.label}, 기온 {settings.temperature}°C | 미세먼지: {
                airQualityOptions.find(a => a.value === settings.airQuality)?.label
              } | <span className="font-bold">{settings.customMessage}</span>
            </span>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}