"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { auth } from "../firebase";

const context = createContext<{ user: User | null; loadingUser: boolean }>({
  user: null,
  loadingUser: true,
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoadingUser(false);
  });

  return (
    <context.Provider value={{ user, loadingUser }}>
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => useContext(context);

export default AppProvider;
