import { Metadata } from 'next'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryFilters from '@/components/gallery/GalleryFilters'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import UploadGuide from '@/components/gallery/UploadGuide'
import PageLayout from '@/components/layout/PageLayout'
import Section from '@/components/common/Section'

export const metadata: Metadata = {
  title: '갤러리',
  description: '모두하나대축제의 소중한 순간들을 만나보세요. 매년 축제의 다양한 프로그램과 참여자들의 행복한 모습을 담은 사진들을 감상하실 수 있습니다.',
  openGraph: {
    title: '갤러리 | 모두하나대축제 2025',
    description: '모두하나대축제의 소중한 순간들을 사진으로 만나보세요.',
  },
}

// 서버 컴포넌트에서 갤러리 데이터 가져오기 (실제로는 DB나 API에서)
async function getGalleryData() {
  // 실제 구현에서는 데이터베이스나 CMS에서 데이터를 가져옴
  return {
    years: ['2024', '2023', '2022', '2021'],
    categories: [
      { id: 'all', name: '전체', count: 156 },
      { id: 'opening', name: '개막식', count: 24 },
      { id: 'performance', name: '공연', count: 38 },
      { id: 'experience', name: '체험부스', count: 45 },
      { id: 'booth', name: '자조모임', count: 28 },
      { id: 'moments', name: '순간포착', count: 21 },
    ],
    totalPhotos: 156
  }
}

export default async function GalleryPage() {
  const galleryData = await getGalleryData()

  return (
    <PageLayout variant="gray" useFontPaper={false}>
      {/* 히어로 섹션 */}
      <GalleryHero totalPhotos={galleryData.totalPhotos} />

      {/* 메인 콘텐츠 */}
      <Section>
        {/* 필터 섹션 */}
        <div className="mb-8">
          <GalleryFilters
            years={galleryData.years}
            categories={galleryData.categories}
          />
        </div>

        {/* 갤러리 그리드 */}
        <div className="mb-16">
          <GalleryGrid />
        </div>

        {/* 업로드 가이드 */}
        <div>
          <UploadGuide />
        </div>
      </Section>
    </PageLayout>
  )
}