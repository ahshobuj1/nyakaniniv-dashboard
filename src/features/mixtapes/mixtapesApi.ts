import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const mixtapesApi = createApi({
  reducerPath: 'mixtapesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MixTapes'],
  endpoints: (builder) => ({
    getTenantMixTapes: builder.query({
      query: ({tenantId, ...params}) => ({
        url: `/mixtapes/v1/tenant/${tenantId}`,
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['MixTapes'],
    }),
  }),
});

export const {useGetTenantMixTapesQuery} = mixtapesApi;

