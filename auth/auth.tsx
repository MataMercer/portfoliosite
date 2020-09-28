import React, { createContext, useState, useContext, useEffect } from 'react';
import Router from 'next/router';
// eslint-disable-next-line no-unused-vars
import firebase, { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';

type AuthContextProps = {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: firebase.User | null;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadUser() {
      // observer to check if the user is logged in
      auth?.onAuthStateChanged((userObservation: firebase.User | null) => {
        if (userObservation) {
          // User is signed in.
          setUser(userObservation);
        } else {
          setUser(null);
        }
      });
      setLoading(false);
    }
    loadUser();
  });

  const redirectAfterLogin = () => {
    Router.push('/admindashboard');
  };

  const redirectAfterLogout = () => {
    Router.push('/authenticateadmin');
  };

  const login = async (email: string, password: string) => {
    return auth
      ?.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        setUser(firebase.auth().currentUser);
        redirectAfterLogin();
      });
  };

  const logout = () => {
    auth
      ?.signOut()
      .then(() => {
        setUser(null);
        redirectAfterLogout();
        // Sign-out successful.
      })
      .catch((error: FirebaseError) => {
        // An error happened.
      });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
