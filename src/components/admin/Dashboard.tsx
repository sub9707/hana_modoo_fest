// src/components/admin/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Clock,
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { GA4StatsData } from '@/types/GA4';
import { getGA4Stats, revalidateGA4Cache } from '@/app/(dashboard)/admin/dashboard/actions';
import { GA4Charts } from './GA4Charts';
import { ExcelDownloadButton } from './ExcelDownloadButton';

// 통계 카드 컴포넌트
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  iconColor: string;
}

function StatsCard({ title, value, change, changeType, icon: Icon, iconColor }: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// 날짜 범위 선택 컴포넌트
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

function DateRangePicker({ startDate, endDate, onDateChange }: DateRangePickerProps) {
  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onDateChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleQuickSelect(7)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          최근 7일
        </button>
        <button
          onClick={() => handleQuickSelect(30)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          최근 30일
        </button>
        <button
          onClick={() => handleQuickSelect(90)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          최근 90일
        </button>
      </div>
    </div>
  );
}

// 페이지별 통계 테이블
interface PageStatsTableProps {
  pages: GA4StatsData['pages'];
}

function PageStatsTable({ pages }: PageStatsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">페이지별 방문 통계</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                페이지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                페이지뷰
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신규 사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평균 체류시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이탈률
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.slice(0, 20).map((page, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {page.page}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {page.pageTitle}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.pageViews.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.users.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.newUsers.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(page.averageTimeOnPage)}초
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(page.bounceRate * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 메인 Dashboard 컴포넌트
export default function Dashboard() {
  const [statsData, setStatsData] = useState<GA4StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 날짜 범위 상태 (기본값: 최근 30일)
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // 데이터 로드 함수
  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    
    try {
      const result = await getGA4Stats(startDate, endDate);
      
      if (result.success && result.data) {
        setStatsData(result.data);
      } else {
        setError(result.error || 'GA4 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('데이터 로드 중 오류가 발생했습니다.');
      console.error('Dashboard 데이터 로드 오류:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 캐시 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await revalidateGA4Cache();
    await loadData(false);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 초기 로드 및 날짜 변경 시 데이터 로드
  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">데이터 로드 오류</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!statsData) {
    return null;
  }

  const { summary, pages, dailyStats, topSources } = statsData;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GA4 통계 대시보드</h1>
          <p className="text-gray-600">src/app/(site) 페이지의 방문 통계</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          
          <ExcelDownloadButton 
            startDate={startDate} 
            endDate={endDate}
          />
        </div>
      </div>

      {/* 날짜 범위 선택 */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <DateRangePicker 
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="총 페이지뷰"
          value={summary.totalPageViews.toLocaleString()}
          icon={Eye}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="총 사용자"
          value={summary.totalUsers.toLocaleString()}
          icon={Users}
          iconColor="text-green-500"
        />
        <StatsCard
          title="신규 사용자"
          value={summary.totalNewUsers.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="평균 세션 시간"
          value={`${Math.round(summary.averageSessionDuration / 60)}분`}
          icon={Clock}
          iconColor="text-orange-500"
        />
      </div>

      {/* 차트 영역 */}
      <GA4Charts 
        dailyData={dailyStats}
        pageData={pages}
        topSources={topSources}
      />

      {/* 페이지별 상세 통계 */}
      <PageStatsTable pages={pages} />
    </div>
  );
}