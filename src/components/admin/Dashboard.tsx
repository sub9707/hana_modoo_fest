'use client'

import { useState, useEffect } from 'react';
import { GA4StatsData } from '@/types/GA4';
import { getGA4Stats } from '@/app/(dashboard)/admin/dashboard/actions';
import { GA4Charts } from './GA4Charts';
import { Eye, Users, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { ExcelDownloadButton } from './ExcelDownloadButton';

// 통계 카드 컴포넌트
function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  iconColor 
}: { 
  title: string; 
  value: string; 
  icon: any;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// 날짜 범위 선택 컴포넌트
function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateChange 
}: { 
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">시작일</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          max={endDate}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <span className="text-gray-500">-</span>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">종료일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          min={startDate}
          max={new Date().toISOString().split('T')[0]}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
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
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  // 날짜 변경 핸들러
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">GA4 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!statsData) return null;

  const { summary, dailyStats, pages, topSources } = statsData;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">GA4 통계</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
    </div>
  );
}