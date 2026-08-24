import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

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
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
};

export const supportTicketsApi = createApi({
    reducerPath: 'supportTicketsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['SupportTickets'],
    endpoints: builder => ({
        getSupportTickets: builder.query<
            { data: TSupportTicket[]; meta: { pagination: { total: number; page: number; limit: number; totalPages: number } } },
            {
                page?: number;
                limit?: number;
                search?: string;
                status?: string;
                sortBy?: string;
                sortOrder?: string;
            }
        >({
            query: params => ({
                url: '/tickets/v1/all',
                method: 'GET',
                params: {
                    ...params,
                    status: params.status === 'all' ? undefined : params.status,
                },
            }),
            providesTags: ['SupportTickets'],
        }),
        updateTicketStatus: builder.mutation<
            TSupportTicket,
            { id: string; status: TicketStatus }
        >({
            query: ({ id, status }) => ({
                url: `/tickets/v1/${id}/status`,
                method: 'PATCH',
                data: { status },
            }),
            invalidatesTags: ['SupportTickets'],
        }),
    }),
});

export const { useGetSupportTicketsQuery, useUpdateTicketStatusMutation } =
    supportTicketsApi;
