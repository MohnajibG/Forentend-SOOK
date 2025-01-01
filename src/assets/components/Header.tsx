import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import logo from "../img/LOGO.png";
import { CgProfile } from "react-icons/cg";
import { BsFillBasket3Fill } from "react-icons/bs";

import "../styles/header.css";
import "../styles/burgerMenu.css";

import { HeaderProps } from "../../types/types";

const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { token, userId, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

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
              <Link
                to={`/profilePage/${userId}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profil
              </Link>
            </p>
            <p>
              <Link to="/offers" onClick={() => setIsMenuOpen(false)}>
                Offres
              </Link>
            </p>
            <p>
              <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
            </p>
            <p>
              <Link to="/publish" onClick={() => setIsMenuOpen(false)}>
                Publier
              </Link>
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
              <div className="panier">
                <BsFillBasket3Fill />
              </div>
              {isMenuOpen && (
                <div className="burger-menu" ref={menuRef}>
                  <ul>
                    {userId && (
                      <li>
                        <Link
                          to={`/profilePage/${userId}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profil
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link to="/offers" onClick={() => setIsMenuOpen(false)}>
                        Offres
                      </Link>
                    </li>
                    <li>
                      <Link to="/publish" onClick={() => setIsMenuOpen(false)}>
                        Publier
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                        Panier <BsFillBasket3Fill />
                      </Link>
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
      <div className="search-nav">
        <input
          className="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Recherche"
          aria-label="Champ de recherche"
        />
      </div>
    </header>
  );
};

export default Header;
