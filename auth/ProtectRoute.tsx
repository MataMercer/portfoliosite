import React, { useEffect } from 'react';
import Router from 'next/router';
import { useAuth } from './auth';

type ProtectRouteProps = {
  children: React.ReactNode;
};

export default function ProtectRoute(
  Component: any
): React.FC<ProtectRouteProps> {
  return function (...args) {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push('/authenticateadmin');
    }, [isAuthenticated]);

    return <Component {...args} />;
  };
}
