export enum EngineState {
    IDLE = 'IDLE',
    STARTING = 'STARTING',
    RUNNING = 'RUNNING',
    STOPPING = 'STOPPING',
    ERROR = 'ERROR'
}
}
export interface EngineConfig {
    workerCount: number;
    queueSize: number;
    debugMode?: boolean;
    timeout?: number;
}
{;dedd
export interface IEngine {
    start(): Promise<void>;
    stop(): void;
}
