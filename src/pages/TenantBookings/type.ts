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
  user?: BookingTenantUser | null;
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
  createdAt: string;
  updatedAt: string;
  client?: BookingClient | null;
  tenant?: BookingTenant | null;
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
