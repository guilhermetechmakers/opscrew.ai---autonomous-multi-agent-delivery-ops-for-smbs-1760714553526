import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  requireTwoFactor?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  requireTwoFactor = false,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading skeleton while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirect to login if user is authenticated but trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check email verification requirement
  if (requireEmailVerification && user && !user.email_verified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Check two-factor authentication requirement
  if (requireTwoFactor && user && !user.two_factor_enabled) {
    return <Navigate to="/setup-2fa" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Higher-order component for protected routes
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Add permission logic based on user role
    switch (user.role) {
      case 'admin':
        return true; // Admin has all permissions
      case 'user':
        return ['read', 'write', 'update'].includes(permission);
      case 'viewer':
        return permission === 'read';
      default:
        return false;
    }
  };

  const hasRole = (role: string): boolean => {
    return isAuthenticated && user?.role === role;
  };

  const canAccess = (resource: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Add resource-based access control logic
    const permissions = {
      admin: ['*'],
      user: ['dashboard', 'profile', 'projects'],
      viewer: ['dashboard', 'profile']
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(resource);
  };

  return {
    hasPermission,
    hasRole,
    canAccess,
    isAuthenticated,
    user
  };
}

export default ProtectedRoute;
