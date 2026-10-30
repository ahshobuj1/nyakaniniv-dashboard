export const TransactionStatus = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
} as const;

export const PaymentGateway = {
    PAYSTACK: 'PAYSTACK',
    PESAPAL: 'PESAPAL',
} as const;

export type TTransaction = {
    id: string;
    amount: string | number;
    currency?: string;
    currencyCode?: string;
    status: string;
    method?: string;
    channel?: string;
    gateway?: string;
    type: 'SUBSCRIPTION' | 'BOOKING';
    createdAt: string;
    updatedAt: string;
    
    // For Subscription
    user?: {
        email: string;
        firstName: string;
        lastName: string;
    };
    plan?: {
        name: string;
    };

    // For Booking
    tenant?: {
        subdomain: string;
        stageName: string;
    };
    booking?: {
        client?: {
            name: string;
            email: string;
        };
    };
};
