import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const themeApi = createApi({
  reducerPath: 'themeApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Theme'],
  endpoints: (builder) => ({
    // Fetch all themes
    getAllThemes: builder.query({
      query: (params) => ({
        url: '/themes/v1/',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['Theme'],
    }),
    
    // Update Theme
    updateTheme: builder.mutation({
      query: ({id, data}) => ({
        url: `/themes/v1/${id}`,
        method: 'PATCH',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Theme'],
    }),
  }),
});

export const {
  useGetAllThemesQuery,
  useUpdateThemeMutation,
} = themeApi;
