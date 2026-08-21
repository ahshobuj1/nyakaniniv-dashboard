import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AdminAnalyticsResponse, AdminChartsResponse } from './type';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, void>({
      query: () => ({
        url: '/analytics/v1/admin',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),
    getAdminCharts: builder.query<AdminChartsResponse, void>({
      query: () => ({
        url: '/analytics/v1/admin/charts',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetAdminChartsQuery,
} = analyticsApi;

export * from './type';
