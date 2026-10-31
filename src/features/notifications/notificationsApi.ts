import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import type {
  TNotification,
  GetNotificationsParams,
  NotificationsResponse,
} from './type';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, GetNotificationsParams | void>({
      query: (params) => ({
        url: '/notifications/v1/my-notifications',
        method: 'GET',
        params: params ? {
          ...params,
          category: params.category === 'all' ? undefined : params.category,
          isRead: params.isRead === 'all' ? undefined : params.isRead,
        } : undefined,
      }),
      providesTags: ['Notifications'],
    }),

    getUnreadCount: builder.query<{count: number}, void>({
      query: () => ({
        url: '/notifications/v1/unread-count',
        method: 'GET',
      }),
      transformResponse: (response: {data?: {count?: number}} | {count?: number}) => {
        if ('data' in response && response.data && typeof response.data.count === 'number') {
          return {count: response.data.count};
        }
        if ('count' in response && typeof response.count === 'number') {
          return {count: response.count};
        }
        return {count: 0};
      },
      providesTags: ['Notifications'],
    }),

    markAsRead: builder.mutation<TNotification, string>({
      query: (id) => ({
        url: `/notifications/v1/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllAsRead: builder.mutation<{success: boolean}, void>({
      query: () => ({
        url: '/notifications/v1/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;

