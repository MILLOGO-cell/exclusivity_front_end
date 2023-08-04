import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Ajout de l'état d'authentification

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAuthenticated, // Ajout de l'état d'authentification dans la valeur du contexte
        setIsAuthenticated, // Ajout de la fonction pour mettre à jour l'état d'authentification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
