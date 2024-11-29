import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

import { UserContextType } from "../types/types";

// Initialiser le contexte avec des valeurs par défaut
const UserContext = createContext<UserContextType | null>(null);

// Créer un provider pour envelopper votre application
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Définir l'état initial comme étant null
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Utiliser useEffect pour lire les cookies au démarrage de l'application
  useEffect(() => {
    const storedToken = Cookies.get("token"); // Récupère le token depuis les cookies
    const storedUsername = Cookies.get("username"); // Récupère le username depuis les cookies
    const storedUserId = Cookies.get("userId"); // Récupère le userId depuis les cookies

    if (storedToken && storedUserId && storedUsername) {
      setToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
  }, []); // Ne se lance qu'une fois lors du montage du composant

  // Enregistrer les valeurs dans les cookies chaque fois qu'elles changent
  useEffect(() => {
    if (userId && username && token) {
      Cookies.set("userId", userId, { expires: 7 });
      Cookies.set("username", username, { expires: 7 });
      Cookies.set("token", token, { expires: 7 });
    }
  }, [userId, username, token]); // Mise à jour des cookies lorsque l'état change

  // Fonction de déconnexion
  const logout = () => {
    setUserId(null);
    setUsername(null);
    setToken(null);
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("token");
  };

  return (
    <UserContext.Provider
      value={{ username, userId, token, setUser: setToken, logout }}
    >
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
