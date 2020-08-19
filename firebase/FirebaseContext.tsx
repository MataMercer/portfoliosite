import React, { createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import config from './config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

type FirebaseContextProps = {
  auth: firebase.auth.Auth;
  database: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  loading: boolean;
};

const FirebaseContext = createContext<Partial<FirebaseContextProps>>({});

type FirebaseProviderProps = {
  children: React.ReactNode;
};
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [auth, setAuth] = useState<firebase.auth.Auth>();
  const [database, setDatabase] = useState<firebase.firestore.Firestore>();
  const [storage, setStorage] = useState<firebase.storage.Storage>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    setAuth(firebase.auth());
    setDatabase(firebase.firestore());
    setStorage(firebase.storage());
    setLoading(false);
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, database, storage, loading }}>
      {!loading ? children : null}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const firebaseContext = useContext(FirebaseContext);
  return firebaseContext;
};
