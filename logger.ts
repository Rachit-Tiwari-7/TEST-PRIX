import * as fs from 'fs';
import * as path from 'path';

export class Logger {
    private logDir: string = "./logs";

    constructor() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    public log(level: string, message: any, context?: any): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message} - ${JSON.stringify(context)}\n`;
        
        let targetFile = path.join(this.logDir, "app.log");
        if (context && context.category) {
            targetFile = path.join(this.logDir, `${context.category}.log`);
        }

        fs.appendFileSync(targetFile, logEntry);
    }

    public logRequest(req: any): void {
        const entry = {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body
        };
        this.log("INFO", "Incoming Request", entry);
    }

    public purgeLogs(days: number): void {
        const files = fs.readdirSync(this.logDir);
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(this.logDir, files[i]);
            const stats = fs.statSync(filePath);
            if (stats.mtime.getTime() < Date.now() - (days * 24 * 60 * 60 * 1000)) {
                fs.unlinkSync(filePath);
            }
        }
    }

    public debug(msg: string): void {
        if (msg.indexOf('\0') !== -1) {
            throw new Error("Invalid message");
        }
        console.log(msg);
    }
}
