import { axiosBaseQuery } from '@/app/axiosBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { TLandingPageResponse } from './types';

export const landingPageApi = createApi({
  reducerPath: 'landingPageApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['LandingPage'],
  endpoints: (builder) => ({
    getLandingPage: builder.query<TLandingPageResponse, void>({
      query: () => ({
        url: '/landing-page/v1/content',
        method: 'GET',
      }),
      providesTags: ['LandingPage'],
    }),

    // --- HERO ---
    createHero: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/landing-page/v1/hero',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    updateHero: builder.mutation<any, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/landing-page/v1/hero/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    deleteHero: builder.mutation<any, number>({
      query: (id) => ({
        url: `/landing-page/v1/hero/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LandingPage'],
    }),

    // --- STEP ---
    createStep: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/landing-page/v1/step',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    updateStep: builder.mutation<any, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/landing-page/v1/step/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    deleteStep: builder.mutation<any, number>({
      query: (id) => ({
        url: `/landing-page/v1/step/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LandingPage'],
    }),

    // --- SERVICE ---
    createService: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/landing-page/v1/service',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    updateService: builder.mutation<any, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/landing-page/v1/service/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    deleteService: builder.mutation<any, number>({
      query: (id) => ({
        url: `/landing-page/v1/service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LandingPage'],
    }),

    // --- FAQ ---
    createFaq: builder.mutation<any, any>({
      query: (data) => ({
        url: '/landing-page/v1/faq',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    updateFaq: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/landing-page/v1/faq/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    deleteFaq: builder.mutation<any, number>({
      query: (id) => ({
        url: `/landing-page/v1/faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LandingPage'],
    }),

    // --- SOCIAL ---
    createSocial: builder.mutation<any, any>({
      query: (data) => ({
        url: '/landing-page/v1/social',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    updateSocial: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/landing-page/v1/social/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['LandingPage'],
    }),
    deleteSocial: builder.mutation<any, number>({
      query: (id) => ({
        url: `/landing-page/v1/social/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LandingPage'],
    }),
  }),
});

export const {
  useGetLandingPageQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useCreateSocialMutation,
  useUpdateSocialMutation,
  useDeleteSocialMutation,
} = landingPageApi;
