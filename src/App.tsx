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

function App() {
  const { token, username, userId, logout } = useUser();

  return (
    <UserProvider>
      <Router>
        <Header token={token} logout={logout} />

        <Routes>
          {/* Redirige "/" vers "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Page accessible uniquement si l'utilisateur n'est pas connecté */}
          <Route
            path="/login"
            element={token ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/home" replace /> : <Signup />}
          />
          {/* Routes normales */}
          <Route path="/home" element={<Home />} />
          <Route path="/profileUpdate/:id" element={<ProfileUpdate />} />
          <Route path="/profilePage/:id" element={<ProfilePage />} />
          <Route path="/publish" element={<Publish />} />

          {/* Page 404 */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
