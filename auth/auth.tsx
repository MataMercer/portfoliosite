import React, { createContext, useState, useContext, useEffect } from 'react';
import Router from 'next/router';
// eslint-disable-next-line no-unused-vars
import {
  User,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';

type AuthContextProps = {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadUser() {
      // observer to check if the user is logged in
      auth?.onAuthStateChanged((userObservation: User | null) => {
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
    return auth?.setPersistence(browserLocalPersistence).then(async () => {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
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
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ isAuthenticated: !!user, user, login, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
