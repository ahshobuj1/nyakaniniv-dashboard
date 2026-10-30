import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    getTenantEvents: builder.query({
      query: ({tenantId, ...params}) => ({
        url: `/events/v1/tenant/${tenantId}`,
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Events'],
    }),
  }),
});

export const {useGetTenantEventsQuery} = eventsApi;

