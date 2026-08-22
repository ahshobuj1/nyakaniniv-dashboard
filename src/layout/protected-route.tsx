// src/components/layout/protected-route.tsx
import {Navigate, useLocation} from 'react-router';
import {useAuth} from '@/hooks/useAuth';
import {toast} from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';

import { UserRole } from '@/types/role';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const {isAuthenticated, isLoading, role} = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  // Role check — SUPER_ADMIN or ADMIN allowed
  const allowedRoles: string[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
  if (!role || !allowedRoles.includes(role)) {
    toast.warning('You are not authorized to view this page!');
    return <Navigate to="/login" replace />;
  }

  // Otherwise show children
  return <>{children}</>;
};
