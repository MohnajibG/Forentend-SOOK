// src/components/Layout.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

import Header from "./Header";
import Footer from "./Footer";

import NoMatch from "../pages/noMatch";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import Publish from "../pages/Publish";
import OffersPage from "../pages/OffersPage";
import OfferPage from "../pages/OfferPage";
import Cart from "../pages/Cart";
import MyOffers from "../pages/MyOffers";
import EditOffer from "../pages/EditOffer";

import { useUser } from "../contexts/UserContext";

interface LayoutProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const Layout: React.FC<LayoutProps> = ({ search, setSearch }) => {
  const { token } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fixe en haut */}
      <Header search={search} setSearch={setSearch} />

      {/* Contenu principal qui grandit */}
      <main className="flex-grow">
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
          <Route path="/profilePage/:userId" element={<ProfilePage />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/search/:keyword" element={<OffersPage />} />
          <Route path="/offer/:id" element={<OfferPage />} />
          <Route path="/mesoffres" element={<MyOffers />} />
          <Route path="/offer/update/:id" element={<EditOffer />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>

      {/* Footer collé en bas */}
      <Footer />
    </div>
  );
};

export default Layout;
