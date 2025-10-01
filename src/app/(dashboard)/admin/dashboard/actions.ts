// src/app/(dashboard)/admin/dashboard/actions.ts
'use server'

import { GA4Client } from '@/lib/ga4/client';
import { GA4DateRange, GA4StatsData } from '@/types/GA4';
import { unstable_cache } from 'next/cache';

const getCachedGA4Data = unstable_cache(
  async (startDate: string, endDate: string): Promise<GA4StatsData> => {
    const ga4Client = new GA4Client();
    const dateRange: GA4DateRange = { startDate, endDate };
    
    const results = await Promise.allSettled([
      ga4Client.getOverallStats(dateRange),
      ga4Client.getPageStats(dateRange),
      ga4Client.getDailyStats(dateRange),
      ga4Client.getTrafficSources(dateRange)
    ]);

    const summary = results[0].status === 'fulfilled' ? results[0].value : {
      totalPageViews: 0,
      totalUsers: 0,
      totalNewUsers: 0,
      totalSessions: 0,
      averageBounceRate: 0,
      averageSessionDuration: 0,
    };

    const pages = results[1].status === 'fulfilled' ? results[1].value : [];
    const dailyStats = results[2].status === 'fulfilled' ? results[2].value : [];
    const topSources = results[3].status === 'fulfilled' ? results[3].value : [];

    return {
      summary,
      pages,
      dailyStats,
      topSources
    };
  },
  ['ga4-stats'],
  {
    revalidate: 300,
    tags: ['ga4-data']
  }
);

export async function getGA4Stats(startDate: string, endDate: string): Promise<{
  success: boolean;
  data?: GA4StatsData;
  error?: string;
}> {
  try {
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

function formatExcelDate(dateString: string): string {
  if (!dateString) return '';
  
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  
  return dateString;
}

export async function exportGA4DataToExcel(startDate: string, endDate: string): Promise<{
  success: boolean;
  data?: number[];
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

    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    
    // 1. 요약 통계 시트
    const summaryData = [
      ['GA4 통계 리포트'],
      ['기간', `${startDate} ~ ${endDate}`],
      [],
      ['지표', '값'],
      ['총 페이지뷰', result.data.summary.totalPageViews],
      ['총 사용자', result.data.summary.totalUsers],
      ['신규 사용자', result.data.summary.totalNewUsers],
      ['평균 세션 시간', `${Math.round(result.data.summary.averageSessionDuration / 60)}분`],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // 스타일 적용을 위한 컬럼 너비 설정
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 25 }];
    
    // 제목 행 병합 (A1:B1)
    if (!summarySheet['!merges']) summarySheet['!merges'] = [];
    summarySheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, '요약 통계');
    
    // 2. 일별 방문자 트렌드
    const dailyHeaders = ['날짜', '페이지뷰', '사용자', '신규 사용자'];
    const dailyData = [
      ['일별 방문자 트렌드'],
      [],
      dailyHeaders,
      ...result.data.dailyStats.map(daily => [
        formatExcelDate(daily.date),
        daily.pageViews,
        daily.users,
        daily.newUsers
      ]),
      [],
      ['* Excel에서 삽입 > 차트를 이용하여 그래프를 생성할 수 있습니다.']
    ];
    
    const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
    dailySheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    
    // 제목 행 병합
    if (!dailySheet['!merges']) dailySheet['!merges'] = [];
    dailySheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    
    XLSX.utils.book_append_sheet(workbook, dailySheet, '일별 방문자 트렌드');
    
    // 3. 페이지별 방문 통계
    const pageHeaders = ['순위', '페이지 경로', '페이지뷰'];
    const pageData = [
      ['페이지별 방문 통계 (상위 15개)'],
      [],
      pageHeaders,
      ...result.data.pages.slice(0, 15).map((page, index) => [
        index + 1,
        page.page,
        page.pageViews
      ]),
      [],
      ['* Excel에서 삽입 > 차트 > 막대 차트를 이용하여 그래프를 생성할 수 있습니다.']
    ];
    
    const pageSheet = XLSX.utils.aoa_to_sheet(pageData);
    pageSheet['!cols'] = [
      { wch: 8 },
      { wch: 60 },
      { wch: 15 }
    ];
    
    // 제목 행 병합
    if (!pageSheet['!merges']) pageSheet['!merges'] = [];
    pageSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
    
    XLSX.utils.book_append_sheet(workbook, pageSheet, '페이지별 방문 통계');
    
    // 4. 트래픽 소스
    const totalUsers = result.data.topSources.reduce((sum, source) => sum + source.users, 0);
    const sourceHeaders = ['순위', '소스', '사용자', '비율(%)'];
    const sourceData = [
      ['트래픽 소스 (상위 6개)'],
      [],
      sourceHeaders,
      ...result.data.topSources.slice(0, 6).map((source, index) => {
        const sourceName = source.source === '(direct)' ? '직접 방문' : source.source;
        const percent = totalUsers > 0 ? ((source.users / totalUsers) * 100).toFixed(1) : '0.0';
        return [
          index + 1,
          sourceName,
          source.users,
          parseFloat(percent)
        ];
      }),
      [],
      ['* Excel에서 삽입 > 차트 > 원형 차트를 이용하여 그래프를 생성할 수 있습니다.']
    ];
    
    const sourceSheet = XLSX.utils.aoa_to_sheet(sourceData);
    sourceSheet['!cols'] = [
      { wch: 8 },
      { wch: 35 },
      { wch: 15 },
      { wch: 12 }
    ];
    
    // 제목 행 병합
    if (!sourceSheet['!merges']) sourceSheet['!merges'] = [];
    sourceSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    
    XLSX.utils.book_append_sheet(workbook, sourceSheet, '트래픽 소스');
    
    // Excel 파일 생성
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const excelArray: number[] = Array.from(new Uint8Array(excelBuffer));
    
    const filename = `GA4_통계_${startDate}_${endDate}.xlsx`;
    
    return {
      success: true,
      data: excelArray,
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

export async function revalidateGA4Cache(): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('ga4-data');
}