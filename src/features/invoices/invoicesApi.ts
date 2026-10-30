import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const invoicesApi = createApi({
  reducerPath: 'invoicesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Invoices'],
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: (params) => ({
        url: '/invoices/v1/all',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Invoices'],
    }),
    getInvoiceById: builder.query({
      query: (id: string) => ({
        url: `/invoices/v1/${id}`,
        method: 'GET',
      }),
      providesTags: ['Invoices'],
    }),
  }),
});

export const {useGetAllInvoicesQuery, useGetInvoiceByIdQuery} = invoicesApi;

