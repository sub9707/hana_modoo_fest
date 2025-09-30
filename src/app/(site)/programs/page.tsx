import { Metadata } from 'next'
import ProgramHero from '@/components/programs/ProgramHero'
import ProgramTabs from '@/components/programs/ProgramTabs'

export const metadata: Metadata = {
  title: '행사 프로그램 안내',
  description: '모두하나대축제 2025 행사 프로그램 안내. 행사 일정, 전체행사안내, 행사장 안내도를 확인하세요.',
  openGraph: {
    title: '행사 프로그램 안내 | 모두하나대축제 2025',
    description: '모두하나대축제 2025 행사 프로그램 안내. 행사 일정, 전체행사안내, 행사장 안내도를 확인하세요.',
    images: [
      {
        url: '/images/modoo_hana_image.png',
        width: 332,
        height: 265,
        alt: '모두하나대축제 2025 로고',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  }
}

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 font-paper">
      {/* 히어로 섹션 */}
      <ProgramHero />

      {/* 탭 및 컨텐츠 섹션 */}
      <ProgramTabs />
    </div>
  )
}