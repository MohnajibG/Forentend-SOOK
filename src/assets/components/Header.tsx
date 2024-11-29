import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useUser } from "../../contexts/UserContext";

import { HeaderProps } from "../../types/types";

import logo from "../img/LOGO.png";
import { CgProfile } from "react-icons/cg";

import "../styles/header.css";

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const { token, userId, logout } = useUser(); // Utilisation directe du contexte
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gestion du clic en dehors pour fermer le menu burger
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        !document.querySelector(".burger-menu")?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && address.trim()) {
      navigate(`/search?query=${encodeURIComponent(address)}`);
    }
  };

  return (
    <div className="header">
      <Link to="/home">
        <img src={logo} alt="Le logo de Sook!" />
      </Link>
      <div className="header-inpt-btn">
        <input
          className="search"
          id="search"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Recherche"
          aria-label="Champ de recherche"
        />
        {token ? (
          <div className="dct-div">
            <button
              className="deconnexion"
              onClick={() => {
                logout();
                navigate("/home");
              }}
              aria-label="Bouton de déconnexion"
            >
              Déconnexion
            </button>
            <div className="profileUpdate-icon" onClick={toggleMenu}>
              <CgProfile />
            </div>
            {isMenuOpen && (
              <div className="burger-menu">
                <ul>
                  {userId && (
                    <li>
                      <Link
                        to={`/${userId}/profile`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profil
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      Réglages
                    </Link>
                  </li>
                  <li>
                    <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                      Accueil
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
  );
};

export default Header;
