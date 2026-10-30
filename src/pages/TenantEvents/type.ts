export interface EventTenantUser {
  profileImg?: string | null;
}

export interface EventTenant {
  id: string;
  stageName: string | null;
  subdomain: string | null;
  logoUrl?: string | null;
  user?: EventTenantUser | null;
}

export interface EventItem {
  id: string;
  tenantId: string | null;
  title: string | null;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  capacity: number | null;
  price: string | number | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: EventTenant | null;
}

export interface EventsResponse {
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
  data: EventItem[];
}

