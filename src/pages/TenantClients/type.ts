export interface ClientBooking {
  id: string;
  eventType: string | null;
  eventDate: string | null;
  status: string;
  totalAmount?: string | number | null;
  currencyCode?: string | null;
}

export interface ClientTenantUser {
  profileImg?: string | null;
}

export interface ClientTenant {
  id: string;
  stageName: string | null;
  subdomain: string | null;
  logoUrl?: string | null;
  user?: ClientTenantUser | null;
}

export interface Client {
  id: string;
  tenantId: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
  bookings?: ClientBooking[];
  tenant?: ClientTenant | null;
}

export interface ClientsResponse {
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
  data: Client[];
}

