import { requireRole } from '@/lib/mysql/server'
import { WeatherBannerForm } from './WeatherBannerForm'

export const metadata = {
  title: '날씨 배너 설정 | 관리자',
  description: '날씨 배너를 설정합니다.'
}

export default async function WeatherBannerSettingsPage() {
  await requireRole('admin')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">날씨 배너 설정</h1>
        <p className="text-gray-600 mt-2">/directions 페이지 상단의 날씨 배너를 설정합니다</p>
      </div>

      <WeatherBannerForm />
    </div>
  )
}
