import { UserSubscription } from '../billing/BillingService';

export interface Notification {
    id: string;
    userId: string;
    type: 'email' | 'sms' | 'push';
    content: string;
    sentAt?: Date;
}

export class NotificationManager {
    private queue: Notification[] = [];

    async queueNotification(notification: Notification) {
        this.queue.push(notification);
        // BUG: Not awaiting the send call, could lead to unhandled rejections if it fails
        this.sendNext();
    }

    private async sendNext() {
        if (this.queue.length === 0) return;
        const next = this.queue.shift();
        if (next) {
            console.log(`Sending ${next.type} to ${next.userId}...`);
            // Mocking network delay
            await new Promise(r => setTimeout(r, 500));
            
            // BUG: Logic error - always assumes success
            next.sentAt = new Date();
            console.log("Notification sent successfully");
        }
    }

    // Large method to simulate complex logic
    async handleSubscriptionChange(sub: UserSubscription) {
        if (sub.active) {
            await this.queueNotification({
                id: Math.random().toString(),
                userId: sub.userId,
                type: 'email',
                content: `Your subscription to ${sub.planId} is now active!`
            });
        }
    }
}
