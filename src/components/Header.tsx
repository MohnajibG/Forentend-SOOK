// src/components/Header.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { motion, AnimatePresence } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";
import { FiHome, FiPlusCircle, FiList } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

import logo from "../assets/img/LOGO.png";
import Search from "./Search";
import { HeaderProps } from "../types/types";
import Nav from "./Nav";

function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();
  const { token, userId, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <header
      className=" 
    fixed md:relative top-0 left-0 w-full
    flex flex-col gap-4 justify-center p-4 font-[Krub]
    bg-[rgba(249,200,208,0.55)] backdrop-blur-sm 
    shadow-[0_0_13px_rgba(255,255,255,0.4)]
    z-40
  "
    >
      <div className="flex items-center justify-between border-b border-[#dbc4b8]">
        {/* Logo */}
        <Link to="/home">
          <img
            src={logo}
            alt="Sook logo"
            className="h-12 w-12 rounded-full object-cover border-2 border-black"
          />
        </Link>

        {/* Navigation desktop */}
        {token && <Nav />}

        {/* Zone boutons */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              {/* Déconnexion (desktop) */}
              <button
                className="hidden md:block px-4 py-2 bg-[#da0d0df9] text-white font-bold hover:bg-[#ff2f2ff4] transition-colors"
                onClick={handleLogout}
              >
                Déconnexion
              </button>

              {/* Icône panier */}
              <Link
                to="/cart"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ffc1bdf2] border-2 border-black"
              >
                <BsFillBasket3Fill className="text-black" />
              </Link>

              {/* Bouton menu burger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ffc1bdf2] border-2 border-black relative md:hidden z-100"
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 45 },
                  }}
                  className="absolute w-6 h-[3px] bg-black"
                  style={{ top: "12px" }}
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="absolute w-6 h-[3px] bg-black"
                />
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: -45 },
                  }}
                  className="absolute w-6 h-[3px] bg-black"
                  style={{ bottom: "12px" }}
                />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-[#dfa080ed] w-40 text-white font-bold hover:bg-[#c87660] transition-colors"
              >
                Signup
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-[#dfa080ed] w-40 text-white font-bold hover:bg-[#c87660] transition-colors"
              >
                Login
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
            className="fixed inset-0 z-50  md:hidden" // 🟢 overlay semi-transparent
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-screen w-64 bg-[#ffc1bd] border-l-2 border-black shadow-lg flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col divide-y divide-[#e66b19] mt-12">
                <li>
                  <Link
                    to={`/profilePage/${userId}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <CgProfile /> Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <FiHome /> Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/offers"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <FiList /> Offres
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mesoffres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <FiList /> Mes Offres
                  </Link>
                </li>
                <li>
                  <Link
                    to="/publish"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <FiPlusCircle /> Publier
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <BsFillBasket3Fill /> Panier
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-5 py-3 text-[#333] hover:bg-[#ffe0dc]"
                  >
                    <BiLogOut /> Déconnexion
                  </button>
                </li>

                <div className="absolute bottom-4 left-0 w-full text-center text-sm text-[#333] flex items-center justify-center pb-20">
                  &copy; 2025 SOOK. All rights reserved.
                  <img
                    src={logo}
                    alt="logo Sook"
                    className="border-2 border-black rounded-full w-20 inline-block ml-2 object-cover "
                  />
                </div>
              </ul>
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
