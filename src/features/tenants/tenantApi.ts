import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const tenantApi = createApi({
  reducerPath: 'tenantApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Tenant'],
  endpoints: (builder) => ({
    // Fetch all tenants (Admin)
    getAllTenants: builder.query({
      query: (params) => ({
        url: '/tenant/v1/',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Tenant'],
    }),
  }),
});

export const {
  useGetAllTenantsQuery,
} = tenantApi;
