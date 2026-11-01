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
  bookingId?: string;
  version: number;
  amount: number | string;
  currency?: string | null;
  currencyCode?: string | null;
  notes: string | null;
  status: string;
  proposedBy?: string;
  proposedByRole?: string;
  createdAt: string;
  acceptedAt?: string | null;
}

export interface BookingAgreement {
  id: string;
  bookingId: string;
  quoteId?: string | null;
  agreedAmount: number | string;
  agreedCurrency?: string | null;
  currencyCode?: string | null;
  snapshotAt?: string | null;
  createdAt: string;
  termsVersion?: string | null;
}

export interface BookingMessage {
  id: string;
  bookingId?: string;
  senderType?: 'CLIENT' | 'DJ' | 'ADMIN' | string;
  senderRole?: 'CLIENT' | 'DJ' | 'ADMIN' | string;
  senderId?: string | null;
  content?: string;
  message?: string;
  createdAt: string;
}

export interface BookingAuditEvent {
  id: string;
  bookingId: string;
  actorType: string;
  actorId?: string | null;
  eventType: string;
  metadata?: Record<string, unknown> | null;
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
  paymentDueAt?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  orderReference: string | null;
  directPaymentStatus?: string | null;
  directPaymentMethod?: string | null;
  directPaymentProofUrl?: string | null;
  completionRequestedAt?: string | null;
  completionConfirmedAt?: string | null;
  issueReportedAt?: string | null;
  issueDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: BookingClient | null;
  tenant?: BookingTenant | null;
  quotes?: BookingQuote[];
  agreement?: BookingAgreement | null;
  messages?: BookingMessage[];
  auditEvents?: BookingAuditEvent[];
  review?: BookingReview | null;
  invoice?: {
    id: string;
    invoiceNumber?: string | null;
    amount?: number | string | null;
    currency?: string | null;
    status?: string | null;
    gateway?: string | null;
    createdAt: string;
    transactions?: Record<string, unknown>[];
  } | null;
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
    };
  };
  data: Booking[];
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
