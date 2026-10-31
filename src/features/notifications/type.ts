export type NotificationType = 'booking_request' | 'payment' | 'system';

export interface TNotification {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  referenceId?: string | null;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: 'all' | 'bookings' | 'payments' | 'support' | 'tenants';
  isRead?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationsResponse {
  data: TNotification[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UnreadCountResponse {
  data: {
    count: number;
  };
}
