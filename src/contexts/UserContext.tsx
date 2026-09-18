import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

import { UserContextType } from "../types/types";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // États pour l'utilisateur, initialisés directement depuis les cookies :
  // une lecture différée (via useEffect) laissait les pages protégées
  // s'exécuter une première fois avec userId/token à null et rediriger
  // à tort vers /login avant que le contexte n'ait le temps de se remplir.
  const [userId, setUserId] = useState<string | null>(
    () => Cookies.get("userId") ?? null
  );
  const [username, setUsername] = useState<string | null>(
    () => Cookies.get("username") ?? null
  );
  const [token, setToken] = useState<string | null>(
    () => Cookies.get("token") ?? null
  );

  // Fonction pour définir l'utilisateur
  const setUser = (id: string, newToken: string, name: string) => {
    setUserId(id);
    setToken(newToken);
    setUsername(name);

    // Stocker les informations dans les cookies
    Cookies.set("userId", id, { expires: 7 });
    Cookies.set("username", name, { expires: 7 });
    Cookies.set("token", newToken, { expires: 7 });
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUserId(null);
    setUsername(null);
    setToken(null);

    // Supprimer les cookies
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("token");
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
