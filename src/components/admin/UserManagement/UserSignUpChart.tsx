'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DailySignupData {
  date: string;
  signups: string;
}

interface UserSignupChartProps {
  data: DailySignupData[];
}

// 날짜 포맷팅 함수 (YYYY-MM-DD를 MM/DD로 변환)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export default function UserSignupChart({ data }: UserSignupChartProps) {
  // 차트 데이터 메모이제이션 (Recharts는 새 배열 참조 시 전체 리렌더링)
  const chartData = useMemo(() =>
    data.map(item => ({
      date: formatDate(item.date),
      signups: parseInt(item.signups),
      originalDate: item.date
    })), [data])

  const { totalSignups, avgSignups } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + parseInt(item.signups), 0)
    return {
      totalSignups: total,
      avgSignups: data.length > 0 ? (total / data.length).toFixed(1) : '0'
    }
  }, [data])

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">일별 가입 추이</h3>
          <p className="text-sm text-gray-600 mt-1">2025년 신규 회원 가입 현황</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">기간 내 총 가입</p>
          <p className="text-2xl font-bold text-blue-600">{totalSignups}명</p>
          <p className="text-xs text-gray-500 mt-1">일평균 {avgSignups}명</p>
        </div>
      </div>
      
      <div className="h-80">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            2025년 가입 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [value, '신규 가입']}
                labelFormatter={(label: string, payload: any) => {
                  if (payload && payload.length > 0) {
                    return `${payload[0].payload.originalDate} (${label})`;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3B82F6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}