import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Skeleton } from '../ui/Skeleton';

export function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="p-8 space-y-4 max-w-4xl mx-auto w-full">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>);

  }
  if (!user) return <Navigate to={`/auth?mode=signin&next=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}