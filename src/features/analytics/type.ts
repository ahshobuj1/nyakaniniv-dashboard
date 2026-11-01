export interface PlanSubscriptionStats {
  planId: number;
  planName: string;
  priceMonthly: number;
  priceAnnually: number;
  isActive: boolean;
  activeSubscribers: number;
  totalPurchases: number;
}

export interface SubscriptionStats {
  active: number;
  canceled: number;
  pastDue: number;
  total?: number;
  byPlan?: PlanSubscriptionStats[];
}

export interface RecentBookingClient {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface RecentBookingTenantUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface RecentBookingTenant {
  id?: string;
  subdomain?: string;
  stageName?: string;
  logoUrl?: string;
  user?: RecentBookingTenantUser;
}

export interface RecentBooking {
  id: string;
  orderReference?: string;
  currencyCode?: string;
  client?: RecentBookingClient;
  clientName?: string;
  clientEmail?: string;
  eventType: string;
  eventDate?: string;
  address?: string;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  directPaymentStatus?: string;
  createdAt: string;
  tenant?: RecentBookingTenant;
}

export interface CurrencyRevenueBreakdown {
  currency: string;
  amount: number;
  amountUsd?: number | null;
  count: number;
}

export interface AdminAnalyticsData {
  totalUsers: number;
  totalTenants: number;
  totalBookings: number;
  reportingCurrency?: string;
  totalRevenue: number;
  revenueByCurrency?: CurrencyRevenueBreakdown[];
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
