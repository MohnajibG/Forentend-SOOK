import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

import Login from "./assets/pages/login";
import Signup from "./assets/pages/signup";
import Profile from "./assets/pages/profile";
import Header from "./assets/components/Header";
import NoMatch from "./assets/pages/noMatch";
import Home from "./assets/pages/home";

function App() {
  // Gestion du token et du nom d'utilisateur avec `useState` et les cookies
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null
  );
  const [username, setUsername] = useState<string | null>(
    Cookies.get("username") || null
  );

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
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={
            <Signup handleToken={handleToken} handleUsername={handleUsername} />
          }
        />
        <Route
          path="/profile"
          element={<Profile username={username} token={token} />}
        />
        {/* Page par défaut si aucune route ne correspond */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
