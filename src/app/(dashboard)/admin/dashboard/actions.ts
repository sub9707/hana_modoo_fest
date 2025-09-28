// src/app/(dashboard)/admin/dashboard/actions.ts
'use server'

import { GA4Client } from '@/lib/ga4/client';
import { GA4DateRange, GA4StatsData } from '@/types/GA4';
import { unstable_cache } from 'next/cache';

// NextJS 15: 향상된 캐싱을 활용한 GA4 데이터 조회
const getCachedGA4Data = unstable_cache(
  async (startDate: string, endDate: string): Promise<GA4StatsData> => {
    const ga4Client = new GA4Client();
    const dateRange: GA4DateRange = { startDate, endDate };
    
    return await ga4Client.getComprehensiveStats(dateRange);
  },
  ['ga4-stats'],
  {
    revalidate: 300, // 5분마다 갱신
    tags: ['ga4-data']
  }
);

export async function getGA4Stats(startDate: string, endDate: string): Promise<{
  success: boolean;
  data?: GA4StatsData;
  error?: string;
}> {
  try {
    // 환경변수 확인
    const requiredEnvVars = [
      'GA4_PROJECT_ID',
      'GA4_PRIVATE_KEY_ID', 
      'GA4_PRIVATE_KEY',
      'GA4_CLIENT_EMAIL',
      'GA4_CLIENT_ID',
      'GA4_PROPERTY_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        success: false,
        error: `GA4 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}`
      };
    }

    const data = await getCachedGA4Data(startDate, endDate);
    
    return {
      success: true,
      data
    };

  } catch (error) {
    console.error('GA4 데이터 조회 오류:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'GA4 데이터 조회에 실패했습니다.'
    };
  }
}

export async function exportGA4DataToExcel(startDate: string, endDate: string): Promise<{
  success: boolean;
  data?: Buffer;
  filename?: string;
  error?: string;
}> {
  try {
    const result = await getGA4Stats(startDate, endDate);
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'GA4 데이터를 가져올 수 없습니다.'
      };
    }

    // 동적 import로 xlsx 라이브러리 로드 (번들 크기 최적화)
    const XLSX = await import('xlsx');
    
    const workbook = XLSX.utils.book_new();
    
    // 1. 요약 통계 시트
    const summaryData = [
      ['지표', '값'],
      ['총 페이지뷰', result.data.summary.totalPageViews],
      ['총 사용자', result.data.summary.totalUsers],
      ['신규 사용자', result.data.summary.totalNewUsers],
      ['총 세션', result.data.summary.totalSessions],
      ['평균 이탈률', `${(result.data.summary.averageBounceRate * 100).toFixed(2)}%`],
      ['평균 세션 시간', `${Math.round(result.data.summary.averageSessionDuration)}초`],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '요약 통계');
    
    // 2. 페이지별 통계 시트
    const pageHeaders = ['페이지 경로', '페이지 제목', '페이지뷰', '사용자', '신규 사용자', '평균 체류시간(초)', '이탈률(%)'];
    const pageData = [
      pageHeaders,
      ...result.data.pages.map(page => [
        page.page,
        page.pageTitle,
        page.pageViews,
        page.users,
        page.newUsers,
        Math.round(page.averageTimeOnPage),
        (page.bounceRate * 100).toFixed(2)
      ])
    ];
    
    const pageSheet = XLSX.utils.aoa_to_sheet(pageData);
    XLSX.utils.book_append_sheet(workbook, pageSheet, '페이지별 통계');
    
    // 3. 일별 통계 시트
    const dailyHeaders = ['날짜', '페이지뷰', '사용자', '신규 사용자', '세션', '이탈률(%)', '평균 세션시간(초)'];
    const dailyData = [
      dailyHeaders,
      ...result.data.dailyStats.map(daily => [
        daily.date,
        daily.pageViews,
        daily.users,
        daily.newUsers,
        daily.sessions,
        (daily.bounceRate * 100).toFixed(2),
        Math.round(daily.averageSessionDuration)
      ])
    ];
    
    const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(workbook, dailySheet, '일별 통계');
    
    // 4. 트래픽 소스 시트
    const sourceHeaders = ['소스', '사용자', '세션', '페이지뷰'];
    const sourceData = [
      sourceHeaders,
      ...result.data.topSources.map(source => [
        source.source,
        source.users,
        source.sessions,
        source.pageViews
      ])
    ];
    
    const sourceSheet = XLSX.utils.aoa_to_sheet(sourceData);
    XLSX.utils.book_append_sheet(workbook, sourceSheet, '트래픽 소스');
    
    // Excel 파일 생성
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    const filename = `GA4_통계_${startDate}_${endDate}.xlsx`;
    
    return {
      success: true,
      data: excelBuffer,
      filename
    };
    
  } catch (error) {
    console.error('Excel 익스포트 오류:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Excel 파일 생성에 실패했습니다.'
    };
  }
}

// 캐시 무효화 함수
export async function revalidateGA4Cache(): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('ga4-data');
}