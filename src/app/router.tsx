// src/app/router.tsx
import {createBrowserRouter} from 'react-router';
import Dashboard from '@/pages/Dashboard/Dashboard';
import DashboardLayout from '@/layout/dashboard-layout';
import Users from '@/pages/Users/Users';
import LoginPage from '@/pages/Login/LoginPage';
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword/ResetPassword';
import Plan from '@/pages/Plan/Plan';
import Transactions from '@/pages/Transactions/Transactions';
import TransactionDetailsPage from '@/pages/Transactions/TransactionDetailsPage';
import LandingPageCMS from '@/pages/LandingPage/LandingPageCMS';
import Tenants from '@/pages/Tenants/Tenants';
import TenantBookings from '@/pages/TenantBookings/TenantBookings';
import TenantInvoices from '@/pages/TenantInvoices/TenantInvoices';
import TenantClients from '@/pages/TenantClients/TenantClients';
import TenantEvents from '@/pages/TenantEvents/TenantEvents';
import TenantMixTapes from '@/pages/TenantMixTapes/TenantMixTapes';
import Bookings from '@/pages/Bookings/Bookings';
import BookingDetailsPage from '@/pages/Bookings/BookingDetailsPage';
import Themes from '@/pages/Themes/Themes';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import SupportTickets from '@/pages/SupportTickets/SupportTickets';
import {ProtectedRoute} from '@/layout/protected-route';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'plans',
        element: <Plan />,
      },

      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'transactions/:id',
        element: <TransactionDetailsPage />,
      },
      {
        path: 'tenants',
        element: <Tenants />,
      },
      {
        path: 'bookings',
        element: <Bookings />,
      },
      {
        path: 'bookings/:id',
        element: <BookingDetailsPage />,
      },
      {
        path: 'tenants/:tenantId/bookings',
        element: <TenantBookings />,
      },
      {
        path: 'tenants/:tenantId/invoices',
        element: <TenantInvoices />,
      },
      {
        path: 'tenants/:tenantId/clients',
        element: <TenantClients />,
      },
      {
        path: 'tenants/:tenantId/events',
        element: <TenantEvents />,
      },
      {
        path: 'tenants/:tenantId/mixtapes',
        element: <TenantMixTapes />,
      },
      {
        path: 'themes',
        element: <Themes />,
      },
      {
        path: 'landing-page',
        element: <LandingPageCMS />,
      },
      {
        path: 'support-tickets',
        element: <SupportTickets />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
