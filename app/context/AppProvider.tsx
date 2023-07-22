"use client";
import { User, onAuthStateChanged } from 'firebase/auth'
import React, { ReactNode, createContext, useContext, useState } from 'react'
import { auth } from '../firebase'

const context = createContext<User | null>(null);

const AppProvider = ({children} : {children : ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    onAuthStateChanged(auth, currentUser => setUser(currentUser))

  return <context.Provider value={user}>{children}</context.Provider>
}

export const useAppContext = () => useContext(context);

export default AppProvider