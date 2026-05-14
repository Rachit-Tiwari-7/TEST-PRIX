export class AnalyticsTracker {
    private static instance: AnalyticsTracker;
    private events: any[] = [];

    private constructor() {}

    static getInstance() {
        if (!AnalyticsTracker.instance) {
            AnalyticsTracker.instance = new AnalyticsTracker();
        }
        return AnalyticsTracker.instance;
    }

    trackEvent(name: string, properties: any) {
        const event = {
            name,
            properties,
            timestamp: new Date().toISOString()
        };
        this.events.push(event);
        console.log(`Tracking event: ${name}`, properties);
        
        // BUG: Memory leak - the events array grows indefinitely
        if (this.events.length > 1000) {
            this.flush();
        }
    }

    private async flush() {
        console.log("Flushing analytics...");
        // BUG: Not clearing the events array correctly if the network call fails
        try {
            // Mock network call
            await new Promise(r => setTimeout(r, 100));
            this.events = [];
        } catch (e) {
            console.error("Flush failed");
        }
    }
    
    // Add 50+ tracking methods for specific events
    trackLogin(userId: string) { this.trackEvent('login', { userId }); }
    trackLogout(userId: string) { this.trackEvent('logout', { userId }); }
    trackSubscriptionStarted(userId: string, plan: string) { this.trackEvent('subscription_started', { userId, plan }); }
}
