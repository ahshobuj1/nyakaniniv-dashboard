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
import LandingPageCMS from '@/pages/LandingPage/LandingPageCMS'; // ✨ Import
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
        path: 'landing-page',
        element: <LandingPageCMS />,
      },
      {
        path: '*',
        element: <h1>404</h1>,
      },
    ],
  },
]);

export default router;


