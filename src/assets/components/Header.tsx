import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";

import logo from "../img/LOGO.png";

import { HeaderProps } from "../../types/types";
import "../styles/header.css";
import "../styles/burgerMenu.css";
import Search from "./Search";

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const { token, userId, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  // Fermer les menus quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo-nav-btn">
        <Link to="/home">
          <img src={logo} alt="Le logo de Sook!" />
        </Link>
        {token && (
          <nav className="header-nav">
            <p>
              <Link to={`/profilePage/${userId}`}>Profil</Link>
            </p>
            <p>
              <Link to="/offers">Offres</Link>
            </p>
            <p>
              <Link to="/my-offers">Mes Offres</Link>
            </p>
            <p>
              <Link to="/home">Accueil</Link>
            </p>
            <p>
              <Link to="/publish">Publier</Link>
            </p>
          </nav>
        )}
        <div className="header-inpt-btn">
          {token ? (
            <div className="dct-div">
              <button
                className="deconnexion"
                onClick={handleLogout}
                aria-label="Bouton de déconnexion"
              >
                Déconnexion
              </button>
              <div
                className="profileUpdate-icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <CgProfile />
              </div>
              <Link to="/cart">
                <div className="panier">
                  <BsFillBasket3Fill />
                </div>
              </Link>
              {isMenuOpen && (
                <div className="burger-menu" ref={menuRef}>
                  <ul>
                    <li>
                      <Link to={`/profilePage/${userId}`}>Profil</Link>
                    </li>
                    <li>
                      <Link to="/home">Accueil</Link>
                    </li>
                    <li>
                      <Link to="/offers">Offres</Link>
                    </li>
                    <li>
                      <Link to="/my-offers">Mes Offres</Link>
                    </li>
                    <li>
                      <Link to="/publish">Publier</Link>
                    </li>
                    <li>
                      <Link to="/cart">
                        Panier <BsFillBasket3Fill />
                      </Link>
                    </li>
                    <li>
                      <button
                        className="deconnexion-burger"
                        onClick={handleLogout}
                        aria-label="Bouton de déconnexion"
                      >
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="header-btn">
              <button
                onClick={() => navigate("/signup")}
                className="cnt-btn"
                aria-label="Bouton d'inscription"
              >
                Signup
              </button>
              <button
                onClick={() => navigate("/login")}
                className="cnt-btn"
                aria-label="Bouton de connexion"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      <Search search={search} setSearch={setSearch} />
    </header>
  );
};

export default Header;
