export const config = {
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.ENABLE_CONSOLE === 'true',
    version: '1.0.0-april-2026'
};
