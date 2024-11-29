import { createContext, useContext, useState, ReactNode } from "react";

import { UserContextType } from "../types/types";

// Définir le type de données que vous voulez partager

// Initialiser le contexte avec des valeurs par défaut
const UserContext = createContext<UserContextType | null>(null);

// Créer un provider pour envelopper votre application
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setUser = (userId: string, token: string, username: string) => {
    setUserId(userId);
    setToken(token);
    setUsername(username);
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setUsername(null);
    // Vous pouvez aussi supprimer le token des cookies ou du localStorage si nécessaire
  };

  return (
    <UserContext.Provider value={{ username, userId, token, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte de l'utilisateur
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  return (
    context || {
      userId: null,
      username: null,
      token: null,
      setUser: () => {},
      logout: () => {},
    }
  );
};
