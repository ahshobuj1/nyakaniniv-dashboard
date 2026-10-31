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
import {supportTicketsApi} from '@/features/support-tickets/supportTicketsApi';
import {bookingsApi} from '@/features/bookings/bookingsApi';
import {invoicesApi} from '@/features/invoices/invoicesApi';
import {clientsApi} from '@/features/clients/clientsApi';
import {eventsApi} from '@/features/events/eventsApi';
import {mixtapesApi} from '@/features/mixtapes/mixtapesApi';
import {notificationsApi} from '@/features/notifications/notificationsApi';

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
    [supportTicketsApi.reducerPath]: supportTicketsApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [invoicesApi.reducerPath]: invoicesApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [mixtapesApi.reducerPath]: mixtapesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
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
      supportTicketsApi.middleware,
      bookingsApi.middleware,
      invoicesApi.middleware,
      clientsApi.middleware,
      eventsApi.middleware,
      mixtapesApi.middleware,
      notificationsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
