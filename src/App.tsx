import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import Profile from "./assets/pages/Profile";
import Header from "./assets/components/Header";
import NoMatch from "./assets/pages/NoMatch";
import Home from "./assets/pages/Home";

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
      <Header token={token} handleToken={handleToken} />
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
        <Route
          path="/profile"
          element={
            token ? (
              <Profile username={username} token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Page par défaut si aucune route ne correspond */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
