// src/app/(dashboard)/admin/dashboard/page.tsx
import { Suspense } from 'react';
import Dashboard from '@/components/admin/Dashboard';
import { RefreshCw } from 'lucide-react';

// 로딩 컴포넌트
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>

      {/* 날짜 선택 스켈레톤 */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="h-10 bg-gray-200 rounded w-full max-w-md"></div>
      </div>

      {/* 통계 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* 차트 스켈레톤 */}
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-80 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 메타데이터
export const metadata = {
  title: 'GA4 통계 | 관리자',
  description: 'Google Analytics 4 통계 대시보드'
};

// Next.js 15: 동적 렌더링 최적화
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분마다 재검증

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}