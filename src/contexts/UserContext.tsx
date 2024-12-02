import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie"; // Bibliothèque pour manipuler les cookies dans le navigateur.

import { UserContextType } from "../types/types";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // États pour l'utilisateur
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fonction pour définir l'utilisateur
  const setUser = (id: string, newToken: string, name: string) => {
    setUserId(id);
    setToken(newToken);
    setUsername(name);

    // Stocker les informations dans les cookies
    Cookies.set("userId", id, { expires: 7 }); // Expire dans 7 jours
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

  // Récupérer les cookies lorsque le composant se charge
  useEffect(() => {
    const storedUserId = Cookies.get("userId");
    const storedUsername = Cookies.get("username");
    const storedToken = Cookies.get("token");

    if (storedUserId && storedUsername && storedToken) {
      setUser(storedUserId, storedToken, storedUsername);
    }
  }, []); // L'effet ne s'exécute qu'une fois, au montage du composant

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
