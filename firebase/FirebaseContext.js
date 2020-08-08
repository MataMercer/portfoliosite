import React, { createContext, useState, useContext, useEffect } from 'react';
import config from './config';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const FirebaseContext = createContext({});
 
export const FirebaseProvider = ({children}) => {
    const [auth, setAuth] = useState(null);
    const [database, setDatabase] = useState(null);
    const [storage, setStorage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firebase.apps.length) {
        firebase.initializeApp(config);
        }
        setAuth(firebase.auth());
        setDatabase(firebase.firestore());
        setStorage(firebase.storage());
        setLoading(false)

    }, []);

    return(
        <FirebaseContext.Provider
        value={{auth, database, storage, loading}}
        >
        {!loading ? children: null}
        </FirebaseContext.Provider>
    );
}


export const useFirebase = () => {
    const firebaseContext = useContext(FirebaseContext);
    return firebaseContext;
};