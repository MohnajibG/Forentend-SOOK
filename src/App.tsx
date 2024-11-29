import { useEffect } from "react";
import Cookies from "js-cookie";
import { UserProvider, useUser } from "./contexts/UserContext"; // Importer UserProvider et useUser
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./assets/components/Header";
import NoMatch from "../src/pages/noMatch";
import Home from "./pages/Home";
import ProfileUpdate from "./pages/ProfileUpdate";
import ProfilePage from "./pages/ProfilePage";
import Publish from "./pages/Publish";

function App() {
  const { setUser, token, username, userId, logout } = useUser(); // Utiliser le contexte

  // Charger les cookies et mettre à jour le contexte lors du premier rendu
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUsername = Cookies.get("username");
    const storedUserId = Cookies.get("userId"); // Récupérer userId depuis les cookies

    // Si les cookies sont valides, définir le contexte utilisateur
    if (storedToken && storedUsername && storedUserId) {
      setUser(storedUserId, storedToken, storedUsername); // Passez les 3 arguments
    }
  }, [setUser]);

  // Mettre à jour les cookies chaque fois que token, username ou userId change
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 45 });
    } else {
      Cookies.remove("token");
    }

    if (username) {
      Cookies.set("username", username, { expires: 45 });
    } else {
      Cookies.remove("username");
    }

    if (userId) {
      Cookies.set("userId", userId, { expires: 45 });
    } else {
      Cookies.remove("userId");
    }
  }, [token, username, userId]);

  return (
    <UserProvider>
      {/* Assurez-vous que UserProvider enveloppe tout le Router */}
      <Router>
        <Header token={token} logout={logout} />

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/:id/profileUpdate/"
            element={
              <ProfileUpdate
                username={username}
                token={token}
                userId={userId}
              />
            }
          />
          <Route path="/:id/profilePage" element={<ProfilePage />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/publish" element={<Publish />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
