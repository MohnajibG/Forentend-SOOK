import { useState } from "react";
import { UserProvider, useUser } from "./assets/contexts/UserContext";
import { CartProvider } from "./assets/contexts/CartContext";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";
// import Chat from "./assets/components/Chat";

import NoMatch from "./assets/pages/noMatch";
import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import Home from "./assets/pages/Home";
import ProfileUpdate from "./assets/pages/ProfileUpdate";
import ProfilePage from "./assets/pages/ProfilePage";
import Publish from "./assets/pages/Publish";
import OffersPage from "./assets/pages/OffersPage";
import OfferPage from "./assets/pages/OfferPage";
import Cart from "./assets/pages/Cart";
import MyOffers from "./assets/pages/MyOffers";
import EditOffer from "./assets/pages/EditOffer";

function App() {
  const [search, setSearch] = useState<string>("");
  const { token } = useUser();

  return (
    <UserProvider>
      <CartProvider>
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
            <Route path="/mesoffres" element={<MyOffers />} />
            <Route path="/edit/:id" element={<EditOffer />} />

            <Route path="/cart" element={<Cart />} />

            {/* <Route path="/chat" element={<Chat />} /> */}

            {/* Page 404 */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
