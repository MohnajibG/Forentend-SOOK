import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

import { motion, AnimatePresence } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";
import { FiHome, FiPlusCircle, FiList } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { HiX } from "react-icons/hi";

import logo from "../assets/img/LOGO2.png";
import Search from "./Search";
import Nav from "./Nav";
import { HeaderProps } from "../types/types";

function CartIcon({ count }: { count: number }) {
  return (
    <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/45 hover:bg-white/65 transition-colors">
      <BsFillBasket3Fill className="text-[#4a2c1d]" size={17} />
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
    <header className="glass-rose fixed lg:relative top-0 left-0 w-full p-4 rounded-none z-40">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link
          to="/home"
          className="shrink-0 flex items-center gap-2 transition-transform hover:scale-[1.03]"
        >
          <img
            src={logo}
            alt="Logo SOOK"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white/60"
          />
          <span className="hidden sm:block font-bold text-lg text-[#4a2c1d] tracking-tight">
            SOOK
          </span>
        </Link>

        {/* Navigation desktop */}
        {token && <Nav userId={userId || undefined} />}

        {/* Recherche : toujours au centre, entre le menu et le panier */}
        <div className="flex-1 min-w-[90px] max-w-md mx-auto">
          <Search search={search} setSearch={setSearch} />
        </div>

        {/* Zone actions (toujours à droite) */}
        <div className="flex items-center gap-3 shrink-0">
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
                aria-label="Ouvrir le menu"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/45 hover:bg-white/65 transition-colors relative lg:hidden"
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { rotate: 0 }, open: { rotate: 45 } }}
                  className="absolute w-5 h-[2px] bg-[#4a2c1d]"
                  style={{ top: "16px" }}
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  className="absolute w-5 h-[2px] bg-[#4a2c1d]"
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{ closed: { rotate: 0 }, open: { rotate: -45 } }}
                  className="absolute w-5 h-[2px] bg-[#4a2c1d]"
                  style={{ bottom: "16px" }}
                />
              </button>
            </>
          ) : (
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => navigate("/signup")}
                className="btn-primary px-2.5 py-1.5 text-xs whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm"
              >
                S'inscrire
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary px-2.5 py-1.5 text-xs whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] flex flex-col"
              style={{ background: "var(--color-sook-marron)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-6 pb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Logo SOOK"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#cf9a3f]/60"
                  />
                  <div>
                    <p className="text-white font-bold leading-tight">{username}</p>
                    <p className="text-white/50 text-xs">Bienvenue sur SOOK</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="w-9 h-9 grid place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <HiX size={20} />
                </button>
              </div>

              <ul className="flex flex-col mt-4 px-3 gap-1">
                {[
                  { to: `/profilePage/${userId}`, label: "Profil", icon: <CgProfile /> },
                  { to: "/home", label: "Accueil", icon: <FiHome /> },
                  { to: "/offers", label: "Offres", icon: <FiList /> },
                  { to: "/mesoffres", label: "Mes annonces", icon: <FiList /> },
                  { to: "/publish", label: "Publier", icon: <FiPlusCircle /> },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-[#e6c27a] transition-colors"
                    >
                      {item.icon} {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-[#e6c27a] transition-colors relative"
                  >
                    <BsFillBasket3Fill /> Panier
                    {cart.length > 0 && (
                      <span className="ml-2 bg-[#e60000] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>

              <div className="mt-auto px-3 pb-6">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ff8f8f] hover:bg-white/10 transition-colors"
                >
                  <BiLogOut /> Déconnexion
                </button>
                <p className="text-center text-xs text-white/40 mt-4">
                  © {new Date().getFullYear()} SOOK
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
