'use client'

import { useState, useEffect, useCallback } from 'react'
import { WeatherBannerSettings, weatherMessages, defaultSettings } from './constants'

interface Message {
  type: 'success' | 'error'
  text: string
}

export function useWeatherBanner() {
  const [settings, setSettings] = useState<WeatherBannerSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings/weather-banner')
      const result = await response.json()

      if (result.success && result.data) {
        setSettings({
          weather: result.data.weather || 'sunny',
          temperature: result.data.temperature || 22,
          airQuality: result.data.airQuality || 'normal',
          customMessage: result.data.customMessage || defaultSettings.customMessage
        })
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleWeatherChange = useCallback((weather: string) => {
    setSettings(prev => ({
      ...prev,
      weather: weather as WeatherBannerSettings['weather'],
      customMessage: weatherMessages[weather]
    }))
  }, [])

  const handleAirQualityChange = useCallback((airQuality: string) => {
    setSettings(prev => ({
      ...prev,
      airQuality: airQuality as WeatherBannerSettings['airQuality']
    }))
  }, [])

  const handleTemperatureChange = useCallback((temperature: number) => {
    setSettings(prev => ({ ...prev, temperature }))
  }, [])

  const handleMessageChange = useCallback((customMessage: string) => {
    setSettings(prev => ({ ...prev, customMessage }))
  }, [])

  const resetToDefaultMessage = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      customMessage: weatherMessages[prev.weather]
    }))
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/settings/weather-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
  }, [settings])

  return {
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
  }
}
