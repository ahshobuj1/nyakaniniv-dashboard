import {axiosBaseQuery} from '@/app/axiosBaseQuery';
import {createApi} from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi', // More specific name to avoid conflicts
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Profile'],
  endpoints: (builder) => ({
    // Authentication endpoints
    users: builder.query({
      query: (params) => ({
        url: '/users/v1/',
        method: 'GET',
        params: {...params},
      }),
      providesTags: ['User'],
    }),

    user: builder.query({
      query: (id) => ({
        url: `/users/v1/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUserStatus: builder.mutation({
      query: ({id, isVerified}) => ({
        url: `/users/v1/${id}/status`,
        method: 'PATCH',
        data: {isVerified},
      }),
      invalidatesTags: ['User'],
    }),

    updateUserRole: builder.mutation({
      query: ({id, role}) => ({
        url: `/users/v1/${id}/role`,
        method: 'PATCH',
        data: {role},
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/v1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUsersQuery,
  useUserQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
} = userApi;
