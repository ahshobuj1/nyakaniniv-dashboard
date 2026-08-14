export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TenantCounts {
  mixTapes: number;
  events: number;
  bookings: number;
}

export interface Tenant {
  id: string;
  subdomain: string;
  stageName: string;
  isActive: boolean;
  activePlanId: number | null;
  activePlanName: string;
  user: TenantUser;
  _count: TenantCounts;
}

export interface TenantsResponse {
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
  data: Tenant[];
}
