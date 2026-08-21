export interface SubscriptionStats {
  active: number;
  canceled: number;
  pastDue: number;
}

export interface RecentBookingTenantUser {
  firstName?: string;
  lastName?: string;
}

export interface RecentBookingTenant {
  stageName?: string;
  user?: RecentBookingTenantUser;
}

export interface RecentBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  tenant?: RecentBookingTenant;
}

export interface AdminAnalyticsData {
  totalUsers: number;
  totalTenants: number;
  totalBookings: number;
  totalRevenue: number;
  subscriptions: SubscriptionStats;
  recentBookings: RecentBooking[];
}

export interface MonthlyRevenueData {
  month: string;
  amount: number;
}

export interface MonthlyUserGrowthData {
  month: string;
  count: number;
}

export interface AdminChartsData {
  revenueChart: MonthlyRevenueData[];
  usersGrowthChart: MonthlyUserGrowthData[];
}

export interface AdminAnalyticsResponse {
  success: boolean;
  message?: string;
  data: AdminAnalyticsData;
}

export interface AdminChartsResponse {
  success: boolean;
  message?: string;
  data: AdminChartsData;
}
