import React, { useEffect } from "react";
import Router from "next/router";
import {useAuth} from "./auth";

export function ProtectRoute(Component) {
    return () => {
      const {isAuthenticated, loading } = useAuth();
  
      useEffect(() => {
        if (!isAuthenticated && !loading) Router.push("/authenticateadmin");
      }, [isAuthenticated]);
  
      return <Component {...arguments} />;
    };
  }