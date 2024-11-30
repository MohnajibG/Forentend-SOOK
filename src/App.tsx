import { useEffect } from "react";
import Cookies from "js-cookie";
import { UserProvider, useUser } from "./contexts/UserContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./assets/components/Header";
import NoMatch from "./pages/noMatch";
import Home from "./pages/Home";
import ProfileUpdate from "./pages/ProfileUpdate";
import ProfilePage from "./pages/ProfilePage";
import Publish from "./pages/Publish";
import Footer from "./assets/components/Footer";

// Composant pour rediriger si connecté
const RedirectIfLoggedIn = ({ children }) => {
  const { token } = useUser();
  return token ? <Navigate to="/home" replace /> : children;
};

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  const { token } = useUser();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const { setUser, token, username, userId, logout } = useUser();

  // Charger les cookies et mettre à jour le contexte utilisateur
  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUsername = Cookies.get("username");
    const storedUserId = Cookies.get("userId");

    if (storedToken && storedUsername && storedUserId) {
      setUser(storedUserId, storedToken, storedUsername);
    }
  }, [setUser]);

  // Mettre à jour les cookies lorsque l'état utilisateur change
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
      <Router>
        <Header token={token} logout={logout} />
        <Routes>
          {/* Redirige "/" vers "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Page login accessible uniquement si déconnecté */}
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Login setUser={setUser} />
              </RedirectIfLoggedIn>
            }
          />

          {/* Page signup accessible uniquement si déconnecté */}
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <Signup setUser={setUser} />
              </RedirectIfLoggedIn>
            }
          />

          {/* Route accessible par tous */}
          <Route path="/home" element={<Home />} />

          {/* Routes protégées */}
          <Route
            path="/:id/profileUpdate"
            element={
              <PrivateRoute>
                <ProfileUpdate
                  username={username}
                  token={token}
                  userId={userId}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/:id/profilePage"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/publish"
            element={
              <PrivateRoute>
                <Publish />
              </PrivateRoute>
            }
          />

          {/* Page 404 */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
