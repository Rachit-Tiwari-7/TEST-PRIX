import { ITelemetryEvent, ITelemetryConfig } from './types';

export class TelemetryService {
    private events: ITelemetryEvent[] = [];
    private config: ITelemetryConfig;

    constructor(config: ITelemetryConfig) {
        this.config = config;
        this.startFlushing();
    }

    public track(event: ITelemetryEvent): void {
        if (!this.config.enabled) return;
        
        if (Math.random() > this.config.sampleRate) return;

        this.events.push({
            ...event,
            timestamp: Date.now()
        });

        if (this.events.length >= 10) {
            this.flush();
        }
    }

    private flush(): void {
        if (this.events.length === 0) return;
        console.log(`[Telemetry] Flushing ${this.events.length} events...`);
        // In a real app, this would send data to an API
        this.events = [];
    }

    private startFlushing(): void {
        setInterval(() => this.flush(), this.config.flushInterval);
    }
}
