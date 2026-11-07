'use client'

import { Save, RotateCcw } from 'lucide-react'
import { LoadingSpinner } from '@/components/admin/ui/LoadingSpinner'
import { useWeatherBanner } from './useWeatherBanner'
import { weatherOptions, airQualityOptions } from './constants'

export function WeatherBannerForm() {
  const {
    settings,
    loading,
    saving,
    message,
    handleWeatherChange,
    handleAirQualityChange,
    handleTemperatureChange,
    handleMessageChange,
    resetToDefaultMessage,
    handleSave
  } = useWeatherBanner()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="설정을 불러오는 중..." />
      </div>
    )
  }

  const selectedWeather = weatherOptions.find(w => w.value === settings.weather)

  return (
    <>
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
            onChange={(e) => handleTemperatureChange(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
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
                  onClick={() => handleAirQualityChange(option.value)}
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
              className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              기본 문구로 되돌리기
            </button>
          </div>
          <input
            type="text"
            value={settings.customMessage || ''}
            onChange={(e) => handleMessageChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            placeholder="안내 문구를 입력하세요"
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-2">
            날씨 선택 시 자동으로 문구가 설정되며, 직접 수정할 수도 있습니다
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">미리보기</h4>
          <div className="flex items-center space-x-2 text-gray-700">
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
            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
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
    </>
  )
}
