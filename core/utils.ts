export const validateConfig = (config: any): boolean => {
    return !!(config && config.workerCount > 0 && config.queueSize > 0);
};

export const parseRawPayload = (payload: string): any => {
    try {
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
