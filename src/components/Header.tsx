import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

import { motion, AnimatePresence } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";
import { FiHome, FiPlusCircle, FiList } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

import logo from "../assets/img/LOGO2.png";
import Search from "./Search";
import Nav from "./Nav";
import { HeaderProps } from "../types/types";

function CartIcon({ count }: { count: number }) {
  return (
    <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/40 hover:bg-white/55 transition-colors">
      <BsFillBasket3Fill className="text-[#241118]" size={18} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#e60000] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white/70">
          {count}
        </span>
      )}
    </span>
  );
}

function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();
  const { token, userId, username, logout } = useUser();
  const { cart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <header className="glass-rose fixed lg:relative top-0 left-0 w-full flex flex-col gap-4 justify-center p-4 rounded-none z-40">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link to="/home" className="shrink-0 transition-transform hover:scale-105">
          <img
            src={logo}
            alt="Sook logo"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white/50"
          />
        </Link>

        {/* Navigation desktop */}
        {token && <Nav userId={userId || undefined} className="mr-auto" />}
        {!token && <div className="mr-auto" />}

        {/* Zone actions */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link to="/cart" aria-label="Mon panier" className="hidden lg:block">
                <CartIcon count={cart.length} />
              </Link>

              {/* Déconnexion desktop */}
              <button
                className="hidden lg:block px-4 py-2 rounded-full bg-[#da0d0df9] text-white font-bold text-sm hover:bg-[#ff2f2ff4] transition-colors"
                onClick={handleLogout}
              >
                Déconnexion
              </button>

              {/* Icône panier mobile avec badge */}
              <Link to="/cart" aria-label="Mon panier" className="lg:hidden">
                <CartIcon count={cart.length} />
              </Link>

              {/* Menu burger mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40 hover:bg-white/55 transition-colors relative lg:hidden"
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { rotate: 0 }, open: { rotate: 45 } }}
                  className="absolute w-5 h-[2px] bg-[#241118]"
                  style={{ top: "16px" }}
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  className="absolute w-5 h-[2px] bg-[#241118]"
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { rotate: 0 }, open: { rotate: -45 } }}
                  className="absolute w-5 h-[2px] bg-[#241118]"
                  style={{ bottom: "16px" }}
                />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigate("/signup")} className="btn-primary">
                S'inscrire
              </button>
              <button onClick={() => navigate("/login")} className="btn-primary">
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile slide-in */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="glass-gold fixed top-0 right-0 h-screen w-72 rounded-none flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-5 pt-8 pb-2 text-white/80 text-sm">
                Connecté en tant que <span className="font-bold text-white">{username}</span>
              </p>
              <ul className="flex flex-col divide-y divide-white/20 mt-4">
                <li>
                  <Link
                    to={`/profilePage/${userId}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <CgProfile /> Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <FiHome /> Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/offers"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <FiList /> Offres
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mesoffres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <FiList /> Mes Offres
                  </Link>
                </li>
                <li>
                  <Link
                    to="/publish"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <FiPlusCircle /> Publier
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-white hover:bg-white/15 transition-colors relative"
                  >
                    <BsFillBasket3Fill /> Panier
                    {cart.length > 0 && (
                      <span className="ml-2 bg-[#e60000] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-5 py-4 text-white hover:bg-white/15 transition-colors"
                  >
                    <BiLogOut /> Déconnexion
                  </button>
                </li>
              </ul>

              <div className="mt-auto flex items-center justify-center gap-2 pb-8 pt-4 text-xs text-white/70">
                <img src={logo} alt="Logo SOOK" className="w-8 h-8 rounded-full object-cover" />
                &copy; {new Date().getFullYear()} SOOK
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre de recherche */}
      <Search search={search} setSearch={setSearch} />
    </header>
  );
}

export default Header;
