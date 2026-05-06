import { TelemetryService } from '../src/telemetry/TelemetryService';
import { MetricType } from '../src/telemetry/types';

describe('TelemetryService', () => {
    it('should buffer events before flushing', () => {
        const service = new TelemetryService({ enabled: true, sampleRate: 1, flushInterval: 10000 });
        // Test logic...
    });

    it('should respect sample rate', () => {
        const service = new TelemetryService({ enabled: true, sampleRate: 0, flushInterval: 10000 });
        // Test logic...
    });
});
