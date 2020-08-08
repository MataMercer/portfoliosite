import React, { createContext, useState, useContext, useEffect } from "react";
import Router from "next/router";
import { useFirebase } from "../firebase/FirebaseContext";
import firebase from "firebase/app";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = useFirebase();
  useEffect(() => {
    async function loadUser() {
      auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          setUser(user);
          
        } else {
          setUser(null);
        }
      });
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    return auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(function () {
            setUser(firebase.auth().currentUser);
            redirectAfterLogin();
          });
      })
  };

  const logout = (email, password) => {
    auth
      .signOut()
      .then(function () {
        setUser(null);
        redirectAfterLogout();
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  const redirectAfterLogin = () => {
    Router.push("/admindashboard");
  };

  const redirectAfterLogout = () => {
    Router.push("/authenticateadmin");
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


