export class TaskQueue {
    private items: any[] = [];
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    public async push(item: any): Promise<boolean> {
        if (this.items.length >= this.maxSize) return false;
        this.items.push(item);
        return true;
    }

    public async pop(): Promise<any> {
        return this.items.shift();
    }

    public get length(): number {
        return this.items.length;
    }
}
