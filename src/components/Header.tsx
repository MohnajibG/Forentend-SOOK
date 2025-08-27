import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";
import logo from "../assets/img/LOGO.png";
import Search from "./Search";
import { HeaderProps } from "../types/types";
import Nav from "./Nav";

function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();
  const { token, userId, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col gap-4 justify-center p-4 font-[Krub]">
      <div className="flex items-center justify-between  border-b border-[#dbc4b8] ">
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
        <div className="flex items-center  gap-4">
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
                to={`/cart/${userId}`}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ffc1bdf2] border-2 border-black"
              >
                <BsFillBasket3Fill className="text-black" />
              </Link>

              {/* Burger menu mobile */}
              <div className="relative md:hidden" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="grid gap-1.5 p-2 rounded-md hover:bg-black/5"
                >
                  <span
                    className={`block h-[3px] w-6 bg-[#333] transition-transform duration-300 ${
                      isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-[3px] w-6 bg-[#333] transition-opacity duration-300 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-[3px] w-6 bg-[#333] transition-transform duration-300 ${
                      isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 rounded-md shadow-lg overflow-hidden border-2 border-black bg-[#ffc1bddc]">
                    <ul className="min-w-48 text-sm">
                      {[
                        { to: `/profilePage/${userId}`, label: "Profil" },
                        { to: "/home", label: "Accueil" },
                        { to: "/offers", label: "Offres" },
                        { to: "/mesoffres", label: "Mes Offres" },
                        { to: "/publish", label: "Publier" },
                        { to: `/cart/${userId}`, label: "Panier" },
                      ].map((item, i, arr) => (
                        <li
                          key={item.to}
                          className={`px-5 py-2 border-b ${
                            i === arr.length - 1
                              ? "border-transparent"
                              : "border-[#e66b19]"
                          }`}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-[#333] hover:text-[#f74b4b7c] transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li className="px-5 py-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left text-[#333] hover:text-[#f74b4b7c]"
                        >
                          Déconnexion
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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

      {/* Barre de recherche */}
      <Search search={search} setSearch={setSearch} />
    </header>
  );
}

export default Header;
