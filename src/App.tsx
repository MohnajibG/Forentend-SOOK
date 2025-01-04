import { useState } from "react";
import { UserProvider, useUser } from "./assets/contexts/UserContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import Header from "./assets/components/Header";
import NoMatch from "./assets/pages/noMatch";
import Home from "./assets/pages/Home";
import ProfileUpdate from "./assets/pages/ProfileUpdate";
import ProfilePage from "./assets/pages/ProfilePage";
import Publish from "./assets/pages/Publish";
import Footer from "./assets/components/Footer";
import OffersPage from "./assets/pages/OffersPage";
import OfferPage from "./assets/pages/OfferPage";
import Cart from "./assets/pages/Cart";

function App() {
  const [search, setSearch] = useState<string>("");
  const { token } = useUser();

  return (
    <UserProvider>
      <Router>
        <Header search={search} setSearch={setSearch} />

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/home" replace /> : <Signup />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/profileUpdate/:userId" element={<ProfileUpdate />} />
          <Route path="/profilePage/:userId" element={<ProfilePage />} />

          <Route path="/publish" element={<Publish />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/search/:keyword" element={<OffersPage />} />
          <Route path="/offer/:id" element={<OfferPage />} />

          <Route path="/cart" element={<Cart />} />

          {/* Page 404 */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
