export interface Metrics {
  metricType: string;
  period: number;
  metrics: {
    time: string;
    value: number;
  }[];
  startTime: string;
  endTime: string;
  extend: {
    deployments: {
      createdAt: string;
    }[];
  };
}

export interface MetricsGqlRes {
  metrics: Metrics;
}

export interface MetricsState {
  data: Metrics;
  loading: boolean;
  hasMore: boolean;
}

export enum MetricType {
  Duration = 'duration',
  MaxMemory = 'maxMemory',
  Invocation = 'invocation',
  Traffic = 'traffic',
  IP = 'ip',
  Request = 'request',
}
