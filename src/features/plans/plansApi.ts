import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const plansApi = createApi({
  reducerPath: 'plansApi', // More specific name to avoid conflicts
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plans'],
  endpoints: (builder) => ({
    // Authentication endpoints
    plans: builder.query({
      query: (params) => ({
        url: '/subscriptions/v1/plans',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Plans'],
    }),

    plan: builder.query({
      query: (id) => ({
        url: `/subscriptions/v1/plans/${id}`,
        method: 'GET',
      }),
      providesTags: ['Plans'],
    }),

    createPlan: builder.mutation({
      query: (data) => ({
        url: '/subscriptions/v1/plans',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Plans'],
    }),

    updatePlan: builder.mutation({
      query: ({id, data}) => ({
        url: `/subscriptions/v1/plans/${id}`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: ['Plans'],
    }),

    deletePlan: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/v1/plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plans'],
    }),
  }),
});

export const {
  usePlansQuery,
  usePlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
