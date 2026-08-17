export const TransactionStatus = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
} as const;

export const PaymentGateway = {
    PAYSTACK: 'PAYSTACK',
    CARD: 'CARD',
    CASH: 'CASH'
} as const;

export type TTransaction = {
    id: string;
    amount: string | number;
    status: string;
    method: string;
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
        }
    };
};
