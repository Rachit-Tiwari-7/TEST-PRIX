import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';

export class Logger {
    private logDir: string = "./logs";

    constructor() {
        console.log(`[Logger] Initializing in ${config.env} mode (v${config.version})`);
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    public log(level: string, message: string): void {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        fs.appendFileSync(path.join(this.logDir, 'app.log'), entry);
    }
}
