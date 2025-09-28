// src/types/ga4.ts

export interface GA4Credentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface GA4PageData {
  page: string;
  pageTitle: string;
  pageViews: number;
  uniquePageViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  users: number;
  newUsers: number;
}

export interface GA4DailyData {
  date: string;
  pageViews: number;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface GA4StatsData {
  summary: {
    totalPageViews: number;
    totalUsers: number;
    totalNewUsers: number;
    totalSessions: number;
    averageBounceRate: number;
    averageSessionDuration: number;
  };
  pages: GA4PageData[];
  dailyStats: GA4DailyData[];
  topSources: Array<{
    source: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
}

export interface GA4DateRange {
  startDate: string;
  endDate: string;
}

export interface GA4MetricData {
  dimensionValues: Array<{
    value: string;
  }>;
  metricValues: Array<{
    value: string;
  }>;
}

export interface GA4Response {
  dimensionHeaders: Array<{
    name: string;
  }>;
  metricHeaders: Array<{
    name: string;
    type: string;
  }>;
  rows: GA4MetricData[];
  rowCount: number;
  metadata: {
    dataLossFromOtherRow: boolean;
  };
}