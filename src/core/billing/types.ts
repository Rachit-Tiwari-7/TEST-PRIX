export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELED = 'canceled',
    INCOMPLETE = 'incomplete',
    TRIALING = 'trialing'
}

export enum PaymentMethodType {
    CARD = 'card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
    CRYPTO = 'crypto'
}

export interface CardDetails {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
}

export interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Customer {
    id: string;
    email: string;
    name: string;
    address: BillingAddress;
    paymentMethod?: PaymentMethodType;
}

// Imagine 300+ lines of additional types for tax, coupons, refunds, etc.
export interface TaxRate {
    id: string;
    display_name: string;
    percentage: number;
    inclusive: boolean;
}

export interface Coupon {
    id: string;
    percent_off?: number;
    amount_off?: number;
    duration: 'once' | 'repeating' | 'forever';
}

// ... more types to simulate a real-world scale
