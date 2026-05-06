/**
 * # Telemetry System
 * 
 * This module provides high-performance telemetry tracking for the application.
 * 
 * ## Features
 * - Event buffering
 * - Deterministic sampling
 * - Multi-adapter support (Console, DataDog, NewRelic)
 * - Low-overhead metrics calculation
 * 
 * ## Usage
 * ```ts
 * const telemetry = new TelemetryService(config);
 * telemetry.track({ name: 'api_call', type: MetricType.COUNTER, properties: { path: '/users' } });
 * ```
 */
export const TELEMETRY_VERSION = '1.2.0';
export const DEFAULT_FLUSH_INTERVAL = 30000;
export const MAX_BUFFER_SIZE = 1000;
