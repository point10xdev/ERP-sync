import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ROUTES } from '../constants/routes';
import { Role } from '../../features/types';

/**
 * Props for the PrivateRoute component
 * @property {React.ReactNode} children - Child components to render if authenticated
 * @property {Role[]} allowedRoles - Optional list of roles allowed to access this route
 * @property {boolean} requireAuth - Whether authentication is required (default: true)
 */
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

/**
 * PrivateRoute Component
 * Protects routes by requiring authentication and optionally specific roles
 * Redirects to login page if not authenticated or dashboard if not authorized
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Log access attempts for security monitoring
  useEffect(() => {
    if (!isAuthenticated && requireAuth) {
      console.info(`Unauthorized access attempt to ${location.pathname}`);
    }
    
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      console.warn(`User ${user.username} with role ${user.role} attempted to access restricted route ${location.pathname}`);
    }
  }, [isAuthenticated, user, location.pathname, allowedRoles, requireAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && requireAuth) {
    return <Navigate to={ROUTES.FACULTY_LOGIN} state={{ from: location }} replace />;
  }

  // Redirect to dashboard if user doesn't have required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};