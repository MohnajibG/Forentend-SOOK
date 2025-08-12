import { useState } from "react";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import Chat from "./assets/components/Chat";

import NoMatch from "./pages/noMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProfileUpdate from "./pages/ProfileUpdate";
import ProfilePage from "./pages/ProfilePage";
import Publish from "./pages/Publish";
import OffersPage from "./pages/OffersPage";
import OfferPage from "./pages/OfferPage";
import Cart from "./pages/Cart";
import MyOffers from "./pages/MyOffers";
import EditOffer from "./pages/EditOffer";

import { useUser } from "./contexts/UserContext";

function App() {
  const [search, setSearch] = useState<string>("");

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Header search={search} setSearch={setSearch} />
          <AppRoutes />
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

function AppRoutes() {
  const { token } = useUser(); // Safe ici sous UserProvider

  return (
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

      {/* Si tu veux remettre le chat plus tard */}
      {/* <Route path="/chat" element={<Chat />} /> */}

      {/* Page 404 */}
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
