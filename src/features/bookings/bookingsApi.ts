import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: (params) => ({
        url: '/bookings/v1/admin/all',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Bookings'],
    }),
    getBookingById: builder.query({
      query: (id: string) => ({
        url: `/bookings/v1/admin/${id}`,
        method: 'GET',
      }),
      providesTags: ['Bookings'],
    }),
  }),
});

export const {useGetAllBookingsQuery, useGetBookingByIdQuery} = bookingsApi;

