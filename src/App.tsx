import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom"; // Import de useParams

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./assets/components/Header";
import NoMatch from "../src/pages/noMatch";
import Home from "./pages/Home";
import ProfileUpdate from "./pages/ProfileUpdate";
import ProfilePage from "./pages/ProfilePage";

function App() {
  // Gestion du token et du nom d'utilisateur avec `useState` et les cookies
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null
  );
  const [username, setUsername] = useState<string | null>(
    Cookies.get("username") || null
  );

  // Synchronise l'état avec les cookies si jamais ils changent
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUsername = Cookies.get("username");

    if (storedToken !== token) {
      setToken(storedToken || null);
    }

    if (storedUsername !== username) {
      setUsername(storedUsername || null);
    }
  }, []);

  // Gestion du token avec sauvegarde dans les cookies
  const handleToken = (newToken: string | null) => {
    if (newToken) {
      Cookies.set("token", newToken, { expires: 45 });
      setToken(newToken);
    } else {
      Cookies.remove("token");
      setToken(null);
    }
  };

  // Gestion du nom d'utilisateur avec sauvegarde dans les cookies
  const handleUsername = (newUsername: string | null) => {
    if (newUsername) {
      Cookies.set("username", newUsername, { expires: 45 });
      setUsername(newUsername);
    } else {
      Cookies.remove("username");
      setUsername(null);
    }
  };

  return (
    <Router>
      {/* Le header est toujours visible */}
      <Header token={token} handleToken={handleToken} userId={null} />
      <Routes>
        {/* Redirection vers /home si aucune route n'est spécifiée */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<Home username={username} token={token} />}
        />
        <Route
          path="/login"
          element={
            <Login handleToken={handleToken} handleUsername={handleUsername} />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup handleToken={handleToken} handleUsername={handleUsername} />
          }
        />
        {/* Utilisation de useParams pour obtenir userId dans le composant App */}
        <Route
          path="/:id/profileUpdate/"
          element={
            token ? (
              <ProfileUpdate
                username={username}
                token={token}
                // userId={useParams().id || null} // Utilisation de useParams ici
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/:id/profile" element={<ProfilePage />} />

        {/* Page par défaut si aucune route ne correspond */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
