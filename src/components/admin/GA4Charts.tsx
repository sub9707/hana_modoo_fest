// src/components/admin/GA4Charts.tsx
'use client'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GA4DailyData, GA4PageData } from '@/types/GA4';

interface GA4ChartsProps {
  dailyData: GA4DailyData[];
  pageData: GA4PageData[];
  topSources: Array<{
    source: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
}

// Recharts 호환 타입 (인덱스 시그니처 포함)
interface TrafficSourceData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface PageViewData {
  page: string;
  pageViews: number;
  [key: string]: string | number;
}

interface ChartDailyData {
  date: string;
  pageViews: number;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRatePercent: number;
  sessionDurationMinutes: number;
  [key: string]: string | number;
}

// 색상 팔레트
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

// 날짜 포맷팅 함수 - YYYYMMDD 형식을 MM/DD로 변환
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'NaN') return '';
  
  // YYYYMMDD 형식 처리
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${parseInt(month)}/${parseInt(day)}`;
  }
  
  // 기존 Date 객체 처리
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } catch {
    return '';
  }
};

// 숫자 포맷팅 함수
const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// 파이 차트 커스텀 라벨
// Recharts가 자동으로 계산한 percent는 0~1 사이의 값이므로 100을 곱해야 합니다
const renderCustomLabel = (props: any): string => {
  const { name, percent } = props;
  // percent는 Recharts가 자동으로 계산한 0~1 사이의 값
  return `${name} (${(percent * 100).toFixed(1)}%)`;
};

export function GA4Charts({ dailyData, pageData, topSources }: GA4ChartsProps) {
  // 일별 데이터를 차트용으로 변환
  const chartDailyData: ChartDailyData[] = dailyData
    .filter(day => day.date) // 유효한 날짜만 필터링
    .map(day => ({
      ...day,
      date: formatDate(day.date),
      bounceRatePercent: Math.round(day.bounceRate * 100),
      sessionDurationMinutes: Math.round(day.averageSessionDuration / 60)
    }));

  // 트래픽 소스 데이터를 파이 차트용으로 변환
  // percent 필드를 제거하고 value만 사용 (Recharts가 자동으로 비율 계산)
  const trafficSourceData: TrafficSourceData[] = topSources.slice(0, 6).map((source, index) => ({
    name: source.source === '(direct)' ? '직접 방문' : source.source,
    value: source.users,
    color: COLORS[index % COLORS.length]
  }));

  // 페이지별 방문 데이터 (상위 15개, 막대그래프용)
  const pageViewData: PageViewData[] = pageData.slice(0, 15).map(page => ({
    page: page.page.length > 25 ? page.page.substring(0, 25) + '...' : page.page,
    pageViews: page.pageViews
  }));

  return (
    <div className="space-y-8">
      {/* 일별 트렌드 차트 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 방문자 트렌드</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatNumber}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => [
                  formatNumber(Number(value)),
                  name === 'pageViews' ? '페이지뷰' :
                  name === 'users' ? '사용자' :
                  name === 'newUsers' ? '신규 사용자' : name
                ]}
              />
              <Legend 
                formatter={(value: string) => 
                  value === 'pageViews' ? '페이지뷰' :
                  value === 'users' ? '사용자' :
                  value === 'newUsers' ? '신규 사용자' : value
                }
              />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 페이지별 방문 통계 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">페이지별 방문 통계 (상위 15개)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={pageViewData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatNumber}
              />
              <YAxis 
                type="category" 
                dataKey="page"
                stroke="#6b7280"
                fontSize={11}
                width={140}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [formatNumber(Number(value)), '페이지뷰']}
              />
              <Bar 
                dataKey="pageViews" 
                fill="#3B82F6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 트래픽 소스 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSourceData as any[]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel as any}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [formatNumber(Number(value)), '사용자']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}