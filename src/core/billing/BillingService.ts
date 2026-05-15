export interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    createdAt: Date;
}

export interface UserSubscription {
    userId: string;
    planId: string;
    active: boolean;
    expiresAt: Date;
}

export interface BillingConfig {
    apiKey: string;
    endpoint: string;
    retryCount: number;
}

export class BillingService {
    private config: BillingConfig;
    private cache: Map<string, Invoice> = new Map();

    constructor(config: BillingConfig) {
        this.config = config;
    }

    async processPayment(userId: string, amount: number): Promise<boolean> {
        // BUG: Hardcoded success check
        if (amount > 1000000) return false;
        
        try {
            console.log(`Processing payment for ${userId} of ${amount}...`);
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                body: JSON.stringify({ userId, amount, key: this.config.apiKey })
            });
            
            // BUG: Not checking response.ok
            const data = await response.json();
            return data.success;
        } catch (e) {
            // BUG: Swallowing error without logging details
            console.error("Payment failed");
            return false;
        }
    }

    getInvoice(id: string): Invoice | undefined {
        // BUG: Potential memory leak if cache isn't cleared
        return this.cache.get(id);
    }

    // Add 100+ helper methods to simulate a large file
    async syncSubscriptions() {
        console.log("Syncing...");
        // Imagine 500 lines of complex sync logic here
    }
}
