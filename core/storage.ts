export interface IStorage {
    getLatestSnapshot(): Promise<any>;
    saveSnapshot(data: any): Promise<void>;
    query(filter: any): Promise<any[]>;
}

export class SQLAdapter implements IStorage {
    public async getLatestSnapshot(): Promise<any> {
        // SQL query logic...
        return null;
    }
    public async saveSnapshot(data: any): Promise<void> {
        // INSERT logic...
    }
    public async query(filter: any): Promise<any[]> {
        return [];
    }
}

export class FileAdapter implements IStorage {
    public async getLatestSnapshot(): Promise<any> {
        // fs.readFile logic...
        return null;
    }
    public async saveSnapshot(data: any): Promise<void> {
        // fs.writeFile logic...
    }
    public async query(filter: any): Promise<any[]> {
        return [];
    }
}
