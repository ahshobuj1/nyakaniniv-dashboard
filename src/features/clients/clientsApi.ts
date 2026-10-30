import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Clients'],
  endpoints: (builder) => ({
    getAllClients: builder.query({
      query: (params) => ({
        url: '/clients/v1/admin/all',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Clients'],
    }),
  }),
});

export const {useGetAllClientsQuery} = clientsApi;

