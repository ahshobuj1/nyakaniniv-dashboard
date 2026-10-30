export interface BookingClient {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface BookingTenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImg?: string | null;
}

export interface BookingTenant {
  id: string;
  subdomain: string | null;
  stageName: string | null;
  logoUrl?: string | null;
  country?: string | null;
  city?: string | null;
  user?: BookingTenantUser | null;
  directPaymentInstructions?: Record<string, unknown> | null;
}

export interface BookingQuote {
  id: string;
  version: number;
  amount: number | string;
  currencyCode: string | null;
  notes: string | null;
  status: string;
  proposedByRole: string;
  createdAt: string;
}

export interface BookingAgreement {
  id: string;
  bookingId: string;
  agreedAmount: number | string;
  currencyCode: string | null;
  snapshotAt: string;
  createdAt: string;
  termsVersion?: string | null;
}

export interface BookingMessage {
  id: string;
  senderRole: 'CLIENT' | 'DJ' | 'ADMIN' | string;
  message: string;
  createdAt: string;
}

export interface BookingReview {
  id: string;
  rating: number;
  reviewText: string | null;
  clientName: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  eventType: string | null;
  eventDetails: Record<string, unknown> | null;
  status: string;
  totalAmount: string | number;
  currencyCode: string | null;
  address: string | null;
  eventDate: string | null;
  eventTimezone: string | null;
  paymentStatus: string;
  payoutStatus: string;
  orderReference: string | null;
  directPaymentStatus?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: BookingClient | null;
  tenant?: BookingTenant | null;
  quotes?: BookingQuote[];
  agreement?: BookingAgreement | null;
  messages?: BookingMessage[];
  review?: BookingReview | null;
  _count?: {
    messages: number;
    quotes: number;
  };
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  data: Booking[];
}

