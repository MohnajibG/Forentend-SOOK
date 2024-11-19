import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

import Login from "./assets/pages/login";
import Signup from "./assets/pages/signup";
import Profile from "./assets/pages/profile";
import Header from "./assets/components/Header";
import NoMatch from "./assets/pages/noMatch";

function App() {
  // Gestion du token et du nom d'utilisateur avec `useState` et les cookies
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null
  );
  const [username, setUsername] = useState<string | null>(
    Cookies.get("username") || null
  );

  // Gestion du token avec sauvegarde dans les cookies
  const handleToken = (token: string | null) => {
    if (token) {
      Cookies.set("token", token, { expires: 45 });
      setToken(token);
    } else {
      Cookies.remove("token");
      setToken(null);
    }
  };

  // Gestion du nom d'utilisateur avec sauvegarde dans les cookies
  const handleUsername = (username: string | null) => {
    if (username) {
      Cookies.set("username", username, { expires: 45 });
      setUsername(username);
    } else {
      Cookies.remove("username");
      setUsername(null);
    }
  };

  return (
    <Router>
      {/* Passer le token au Header pour gestion de l'affichage */}
      <Header token={token} handleToken={handleToken} />
      <Routes>
        {/* Route pour correspondre aux pages non trouvées */}
        <Route path="/*" element={<NoMatch />} />
        {/* Route de connexion */}
        <Route
          path="/login"
          element={
            <Login handleToken={handleToken} handleUsername={handleUsername} />
          }
        />
        {/* Route d'inscription */}
        <Route
          path="/signup"
          element={
            <Signup handleToken={handleToken} handleUsername={handleUsername} />
          }
        />
        {/* Route du profil utilisateur */}
        <Route
          path="/profile"
          element={<Profile username={username} token={token} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
