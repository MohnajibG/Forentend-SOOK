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
import OffersPage from "./pages/OfferPage";

function App() {
  const { token } = useUser();

  return (
    <UserProvider>
      <Router>
        <Header />

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
          <Route path="/profileUpdate/:userId" element={<ProfileUpdate />} />
          <Route path="/profilePage/:userId" element={<ProfilePage />} />

          <Route path="/publish" element={<Publish />} />
          <Route path="/offers" element={<OffersPage />} />

          {/* Page 404 */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
