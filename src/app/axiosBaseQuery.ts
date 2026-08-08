// src/app/axiosBaseQuery.ts
import axios, {
  type AxiosProgressEvent,
  type AxiosRequestConfig,
  AxiosError,
} from 'axios';
import {type BaseQueryFn} from '@reduxjs/toolkit/query/react';
import {logout} from '@/features/auth/authSlice';
import type {RootState} from './store';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 10000,
  withCredentials: true,
});


export interface AxiosRequest<TData = unknown> {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: TData | FormData | File;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;

  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const axiosBaseQuery =
  <TData = unknown>(): BaseQueryFn<AxiosRequest<TData>, unknown, unknown> =>
  async ({url, method, data, params, headers, onUploadProgress}, {getState, dispatch}) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const mergedHeaders = {
        ...headers,
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      };

      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: mergedHeaders,
        onUploadProgress,
      });
      return {data: result.data as TData};
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as AxiosError<any>;
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const errorName = error.response?.data?.error?.name;

      const isTokenExpired =
        status === 401 ||
        message === 'jwt expired' ||
        errorName === 'TokenExpiredError';

      if (isTokenExpired) {
        dispatch(logout());
      }
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
