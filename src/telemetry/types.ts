export enum MetricType {
    COUNTER = 'counter',
    GAUGE = 'gauge',
    HISTOGRAM = 'histogram'
}

export interface ITelemetryEvent {
    name: string;
    timestamp: number;
    properties: Record<string, any>;
    type: MetricType;
}

export interface ITelemetryConfig {
    enabled: boolean;
    sampleRate: number;
    flushInterval: number;
}
