// src/app/store.ts
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import {userApi} from '@/features/users/userApi';
import {plansApi} from './../features/plans/plansApi';
import {authApi} from '@/features/auth/authApi';
import {transactionsApi} from '@/features/transactions/transactionsApi';
import {landingPageApi} from '@/features/landing-page/landingPageApi';
import {tenantApi} from '@/features/tenants/tenantApi';
import {themeApi} from '@/features/themes/themeApi';
import {analyticsApi} from '@/features/analytics/analyticsApi';

import {
  // persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [landingPageApi.reducerPath]: landingPageApi.reducer,
    [tenantApi.reducerPath]: tenantApi.reducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      userApi.middleware,
      plansApi.middleware,
      transactionsApi.middleware,
      landingPageApi.middleware,
      tenantApi.middleware,
      themeApi.middleware,
      analyticsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
