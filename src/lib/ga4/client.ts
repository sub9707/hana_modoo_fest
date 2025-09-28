// src/lib/ga4/client.ts

import { JWT } from 'google-auth-library';
import { GA4Credentials, GA4Response, GA4DateRange, GA4StatsData, GA4PageData, GA4DailyData } from '@/types/GA4';

export class GA4Client {
  private jwt: JWT;
  private propertyId: string;

  constructor() {
    // 환경변수 검증
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
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // 환경변수에서 GA4 서비스 계정 정보 로드
    const credentials: GA4Credentials = {
      type: 'service_account',
      project_id: process.env.GA4_PROJECT_ID!,
      private_key_id: process.env.GA4_PRIVATE_KEY_ID!,
      private_key: process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      client_email: process.env.GA4_CLIENT_EMAIL!,
      client_id: process.env.GA4_CLIENT_ID!,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GA4_CLIENT_EMAIL!}`,
    };

    this.propertyId = process.env.GA4_PROPERTY_ID!;

    
    this.jwt = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
  }

  private async makeRequest(requestBody: any): Promise<GA4Response> {
    try {
      await this.jwt.authorize();
      
      const url = `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.jwt.credentials.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GA4 API 오류 응답:', errorText);
        
        if (response.status === 403) {
          throw new Error(`GA4 API 권한 오류: 서비스 계정이 GA4 속성 ${this.propertyId}에 대한 접근 권한이 없습니다. GA4 관리 > 속성 액세스 관리에서 ${this.jwt.email} 계정에 "뷰어" 또는 "분석가" 권한을 부여해주세요.`);
        }
        
        throw new Error(`GA4 API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('GA4 API 요청 실패:', error);
      throw error;
    }
  }

  async getPageStats(dateRange: GA4DateRange): Promise<GA4PageData[]> {
    const requestBody = {
      dateRanges: [dateRange],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' }
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'userEngagementDuration' },
        { name: 'bounceRate' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH',
            value: '/'
          }
        }
      },
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews'
          },
          desc: true
        }
      ],
      limit: 50
    };

    const response = await this.makeRequest(requestBody);
    
    return response.rows?.map(row => ({
      page: row.dimensionValues[0].value,
      pageTitle: row.dimensionValues[1].value,
      pageViews: parseInt(row.metricValues[0].value) || 0,
      uniquePageViews: parseInt(row.metricValues[0].value) || 0, // GA4에서는 screenPageViews를 사용
      users: parseInt(row.metricValues[1].value) || 0,
      newUsers: parseInt(row.metricValues[2].value) || 0,
      averageTimeOnPage: parseFloat(row.metricValues[3].value) || 0,
      bounceRate: parseFloat(row.metricValues[4].value) || 0,
    })) || [];
  }

  async getDailyStats(dateRange: GA4DateRange): Promise<GA4DailyData[]> {
    const requestBody = {
      dateRanges: [dateRange],
      dimensions: [
        { name: 'date' }
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: 'date'
          }
        }
      ]
    };

    const response = await this.makeRequest(requestBody);
    
    return response.rows?.map(row => ({
      date: row.dimensionValues[0].value,
      pageViews: parseInt(row.metricValues[0].value) || 0,
      users: parseInt(row.metricValues[1].value) || 0,
      newUsers: parseInt(row.metricValues[2].value) || 0,
      sessions: parseInt(row.metricValues[3].value) || 0,
      bounceRate: parseFloat(row.metricValues[4].value) || 0,
      averageSessionDuration: parseFloat(row.metricValues[5].value) || 0,
    })) || [];
  }

  async getTrafficSources(dateRange: GA4DateRange) {
    const requestBody = {
      dateRanges: [dateRange],
      dimensions: [
        { name: 'sessionSource' }
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      orderBys: [
        {
          metric: {
            metricName: 'totalUsers'
          },
          desc: true
        }
      ],
      limit: 10
    };

    const response = await this.makeRequest(requestBody);
    
    return response.rows?.map(row => ({
      source: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value) || 0,
      sessions: parseInt(row.metricValues[1].value) || 0,
      pageViews: parseInt(row.metricValues[2].value) || 0,
    })) || [];
  }

  async getOverallStats(dateRange: GA4DateRange) {
    const requestBody = {
      dateRanges: [dateRange],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ]
    };

    const response = await this.makeRequest(requestBody);
    
    if (!response.rows || response.rows.length === 0) {
      return {
        totalPageViews: 0,
        totalUsers: 0,
        totalNewUsers: 0,
        totalSessions: 0,
        averageBounceRate: 0,
        averageSessionDuration: 0,
      };
    }

    const row = response.rows[0];
    return {
      totalPageViews: parseInt(row.metricValues[0].value) || 0,
      totalUsers: parseInt(row.metricValues[1].value) || 0,
      totalNewUsers: parseInt(row.metricValues[2].value) || 0,
      totalSessions: parseInt(row.metricValues[3].value) || 0,
      averageBounceRate: parseFloat(row.metricValues[4].value) || 0,
      averageSessionDuration: parseFloat(row.metricValues[5].value) || 0,
    };
  }

  async getComprehensiveStats(dateRange: GA4DateRange): Promise<GA4StatsData> {
    try {
      const [summary, pages, dailyStats, topSources] = await Promise.all([
        this.getOverallStats(dateRange),
        this.getPageStats(dateRange),
        this.getDailyStats(dateRange),
        this.getTrafficSources(dateRange)
      ]);

      return {
        summary,
        pages,
        dailyStats,
        topSources
      };
    } catch (error) {
      console.error('GA4 데이터 조회 오류:', error);
      throw error;
    }
  }
}