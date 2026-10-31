import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TSupportTicket = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  issue: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  priority?: 'priority' | 'standard';
  hasPrioritySupport?: boolean;
  planName?: string | null;
  activePlan?: {
    id: number;
    name: string;
    priceMonthly?: number;
    features?: Record<string, unknown>;
  } | null;
  tenant?: {
    id: string;
    stageName?: string | null;
    subdomain?: string | null;
  } | null;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role?: string;
    profileImg?: string | null;
    tenant?: {
      id: string;
      stageName?: string | null;
      subdomain?: string | null;
    } | null;
    subscriptions?: Array<{
      id: string;
      status: string;
      plan?: {
        id: number;
        name: string;
      } | null;
    }>;
  } | null;
};

export const supportTicketsApi = createApi({
  reducerPath: 'supportTicketsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['SupportTickets'],
  endpoints: (builder) => ({
    getSupportTickets: builder.query<
      {
        data: TSupportTicket[];
        meta: {
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      },
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        priority?: string;
        plan?: string;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: (params) => ({
        url: '/tickets/v1/all',
        method: 'GET',
        params: {
          ...params,
          status: params.status === 'all' ? undefined : params.status,
          priority: params.priority === 'all' ? undefined : params.priority,
          plan: params.plan === 'all' ? undefined : params.plan,
        },
      }),
      providesTags: ['SupportTickets'],
    }),
    getOpenTicketsCount: builder.query<{count: number}, void>({
      query: () => ({
        url: '/tickets/v1/all',
        method: 'GET',
        params: {
          status: 'open',
          limit: 1,
        },
      }),
      transformResponse: (response: {meta?: {pagination?: {total?: number}}}) => ({
        count: response?.meta?.pagination?.total ?? 0,
      }),
      providesTags: ['SupportTickets'],
    }),
    updateTicketStatus: builder.mutation<
      TSupportTicket,
      {id: string; status: TicketStatus}
    >({
      query: ({id, status}) => ({
        url: `/tickets/v1/${id}/status`,
        method: 'PATCH',
        data: {status},
      }),
      invalidatesTags: ['SupportTickets'],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetOpenTicketsCountQuery,
  useUpdateTicketStatusMutation,
} = supportTicketsApi;
