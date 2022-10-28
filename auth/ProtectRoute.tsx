import { FC, ReactNode, useEffect } from 'react';
import Router from 'next/router';
import { useAuth } from './auth';

type ProtectRouteProps = {
  children: ReactNode;
};

export default function ProtectRoute(Component: any): FC<ProtectRouteProps> {
  return function (...args) {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push('/authenticateadmin');
    }, [isAuthenticated]);

    return <Component {...args} />;
  };
}
