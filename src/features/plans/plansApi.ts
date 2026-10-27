import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const plansApi = createApi({
  reducerPath: 'plansApi', // More specific name to avoid conflicts
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plans', 'Currencies', 'PlanPrices'],
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

    getCurrencies: builder.query<any, void>({
      query: () => ({
        url: '/subscriptions/v1/currencies',
        method: 'GET',
      }),
      providesTags: ['Currencies'],
    }),

    toggleCurrency: builder.mutation<any, {code: string; isActive: boolean}>({
      query: ({code, isActive}) => ({
        url: `/subscriptions/v1/currencies/${code}`,
        method: 'PATCH',
        data: {isActive},
      }),
      invalidatesTags: ['Currencies', 'Plans'],
    }),

    getPlanPrices: builder.query<any, number | string>({
      query: (id) => ({
        url: `/subscriptions/v1/plans/${id}/prices`,
        method: 'GET',
      }),
      providesTags: ['PlanPrices'],
    }),

    setPlanPrice: builder.mutation<
      any,
      {
        planId: number | string;
        currencyCode: string;
        priceMonthly: number;
        priceAnnually: number;
        isActive?: boolean;
      }
    >({
      query: ({planId, currencyCode, ...data}) => ({
        url: `/subscriptions/v1/plans/${planId}/prices/${currencyCode}`,
        method: 'PUT',
        data: {currencyCode, ...data},
      }),
      invalidatesTags: ['PlanPrices', 'Plans'],
    }),
  }),
});

export const {
  usePlansQuery,
  usePlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetCurrenciesQuery,
  useToggleCurrencyMutation,
  useGetPlanPricesQuery,
  useSetPlanPriceMutation,
} = plansApi;
