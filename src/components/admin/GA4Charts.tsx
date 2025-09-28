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

interface TrafficSourceData {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface ChartDailyData {
  date: string;
  pageViews: number;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRatePercent: number;
  sessionDurationMinutes: number;
}

interface TopPageData {
  page: string;
  pageTitle: string;
  pageViews: number;
  users: number;
  newUsers: number;
  averageTimeOnPage: number;
  bounceRate: number;
  pageShort: string;
}

// 색상 팔레트
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 숫자 포맷팅 함수
const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export function GA4Charts({ dailyData, pageData, topSources }: GA4ChartsProps) {
  // 일별 데이터를 차트용으로 변환
  const chartDailyData = dailyData.map(day => ({
    ...day,
    date: formatDate(day.date),
    bounceRatePercent: Math.round(day.bounceRate * 100),
    sessionDurationMinutes: Math.round(day.averageSessionDuration / 60)
  }));

  // 상위 페이지 데이터 (Top 10)
  const topPagesData = pageData.slice(0, 10).map(page => ({
    ...page,
    pageShort: page.page.length > 20 ? page.page.substring(0, 20) + '...' : page.page
  }));

// 트래픽 소스 데이터를 파이 차트용으로 변환 (백분율 미리 계산)
  const totalUsers = topSources.reduce((sum, source) => sum + source.users, 0);
  const trafficSourceData = topSources.slice(0, 6).map((source, index) => ({
    name: source.source === '(direct)' ? '직접 방문' : source.source,
    value: source.users,
    percent: totalUsers > 0 ? (source.users / totalUsers) * 100 : 0,
    color: COLORS[index % COLORS.length]
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
                  name === 'newUsers' ? '신규 사용자' : String(name)
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="페이지뷰"
                dot={{ fill: '#3B82F6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10B981" 
                strokeWidth={2}
                name="사용자"
                dot={{ fill: '#10B981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="신규 사용자"
                dot={{ fill: '#F59E0B', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 인기 페이지 차트 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 페이지 Top 10</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPagesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={formatNumber}
                />
                <YAxis 
                  type="category" 
                  dataKey="pageShort" 
                  stroke="#6b7280"
                  fontSize={11}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [formatNumber(Number(value)), '페이지뷰']}
                  labelFormatter={(label: any) => {
                    const page = topPagesData.find(p => p.pageShort === String(label));
                    return page?.page || String(label);
                  }}
                />
                <Bar 
                  dataKey="pageViews" 
                  fill="#3B82F6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 트래픽 소스 파이 차트 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
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
          
          {/* 커스텀 범례 (레이블 포함) */}
          <div className="mt-4 space-y-2">
            {trafficSourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-gray-600">{source.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-900 font-medium">
                    {formatNumber(source.value)}
                  </span>
                  <span className="text-gray-500">
                    ({source.percent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 세션 품질 지표 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">세션 품질 지표</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                yAxisId="bounce"
                orientation="left"
                stroke="#EF4444"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="duration"
                orientation="right"
                stroke="#8B5CF6"
                fontSize={12}
                tickFormatter={(value) => `${value}분`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => [
                  String(name) === 'bounceRatePercent' ? `${Number(value)}%` : `${Number(value)}분`,
                  String(name) === 'bounceRatePercent' ? '이탈률' : '평균 세션 시간'
                ]}
              />
              <Legend />
              <Line 
                yAxisId="bounce"
                type="monotone" 
                dataKey="bounceRatePercent" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="이탈률 (%)"
                dot={{ fill: '#EF4444', r: 4 }}
              />
              <Line 
                yAxisId="duration"
                type="monotone" 
                dataKey="sessionDurationMinutes" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="평균 세션 시간 (분)"
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}