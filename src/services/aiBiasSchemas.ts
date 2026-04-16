export interface BiasDailySeriesPoint {
  date: string;
  avgScore: number | null;
  count: number;
  baselineMean: number | null;
  deltaFromBaseline: number | null;
  rolling7: number | null;
}

export interface BiasDailySeriesItem {
  jobId: string;
  points: BiasDailySeriesPoint[];
}

export interface BiasDailySeriesData {
  fromDate: string;
  toDate: string;
  days: number;
  xAxis: string[];
  series: BiasDailySeriesItem[];
}

export interface BiasDailySeriesApiResponse {
  success: boolean;
  data: BiasDailySeriesData;
}

export interface BiasThresholdConfig {
  _id?: string;
  jobId: string;
  sdThreshold: number;
  deltaThreshold: number;
  residualThreshold: number;
  fairnessMinThreshold: number;
  enabled: boolean;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BiasThresholdListApiResponse {
  success: boolean;
  data: BiasThresholdConfig[];
}

export interface BiasThresholdUpdatePayload {
  sdThreshold?: number;
  deltaThreshold?: number;
  residualThreshold?: number;
  fairnessMinThreshold?: number;
  enabled?: boolean;
}

export interface BiasThresholdUpsertApiResponse {
  success: boolean;
  data: BiasThresholdConfig;
}

// Example shape for quickly wiring chart components in React.
export const biasDailySeriesResponseExample: BiasDailySeriesApiResponse = {
  success: true,
  data: {
    fromDate: '2026-03-01T00:00:00.000Z',
    toDate: '2026-03-31T23:59:59.999Z',
    days: 30,
    xAxis: ['2026-03-01', '2026-03-02', '2026-03-03'],
    series: [
      {
        jobId: 'FE_001',
        points: [
          {
            date: '2026-03-01',
            avgScore: 74.2,
            count: 12,
            baselineMean: 72.1,
            deltaFromBaseline: 2.1,
            rolling7: 73.6
          },
          {
            date: '2026-03-02',
            avgScore: 75.0,
            count: 9,
            baselineMean: 72.1,
            deltaFromBaseline: 2.9,
            rolling7: 74.1
          },
          {
            date: '2026-03-03',
            avgScore: null,
            count: 0,
            baselineMean: 72.1,
            deltaFromBaseline: null,
            rolling7: 74.1
          }
        ]
      }
    ]
  }
};
