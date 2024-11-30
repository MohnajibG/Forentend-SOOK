import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

import { UserContextType } from "../types/types";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fonction pour mettre à jour les valeurs du contexte
  const setUser = (id: string, newToken: string, name: string) => {
    setUserId(id);
    setToken(newToken);
    setUsername(name);

    Cookies.set("userId", id, { expires: 7 });
    Cookies.set("username", name, { expires: 7 });
    Cookies.set("token", newToken, { expires: 7 });
  };

  // Fonction de déconnexion
  const logout = () => {
    setUserId(null);
    setUsername(null);
    setToken(null);
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("token");
  };

  // Lecture initiale des cookies
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUsername = Cookies.get("username");
    const storedUserId = Cookies.get("userId");

    if (storedToken && storedUsername && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
  }, []);

  // Mise à jour automatique lors d'un changement des cookies
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = Cookies.get("token");
      const storedUsername = Cookies.get("username");
      const storedUserId = Cookies.get("userId");

      if (
        storedToken !== token ||
        storedUsername !== username ||
        storedUserId !== userId
      ) {
        setToken(storedToken || null);
        setUserId(storedUserId || null);
        setUsername(storedUsername || null);
      }
    }, 1000); // Vérifie les cookies toutes les secondes

    return () => clearInterval(interval); // Nettoyage à la désactivation
  }, [token, username, userId]);

  return (
    <UserContext.Provider value={{ username, userId, token, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

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
