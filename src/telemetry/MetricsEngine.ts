import { MetricType, ITelemetryEvent } from './types';

export class MetricsEngine {
    private counters: Map<string, number> = new Map();

    public increment(name: string, value: number = 1): ITelemetryEvent {
        const current = this.counters.get(name) || 0;
        const next = current + value;
        this.counters.set(name, next);

        return {
            name,
            timestamp: Date.now(),
            properties: { value: next },
            type: MetricType.COUNTER
        };
    }

    public recordGauge(name: string, value: number): ITelemetryEvent {
        return {
            name,
            timestamp: Date.now(),
            properties: { value },
            type: MetricType.GAUGE
        };
    }
}
