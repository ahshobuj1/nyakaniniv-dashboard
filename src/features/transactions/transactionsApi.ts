import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const transactionsApi = createApi({
    reducerPath: 'transactionsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Transactions'],
    endpoints: builder => ({
        getTransactions: builder.query({
            query: params => ({
                url: '/invoices/v1/all',
                method: 'GET',
                params: { ...params },
            }),
            providesTags: ['Transactions'],
        }),
        getTransaction: builder.query({
            query: id => ({
                url: `/invoices/v1/${id}`,
                method: 'GET',
            }),
            providesTags: ['Transactions'],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useGetTransactionQuery,
} = transactionsApi;
