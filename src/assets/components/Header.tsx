import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { HeaderProps } from "../../types/types";
import logo from "../img/LOGO.png";
import { CgProfile } from "react-icons/cg";
import "../styles/header.css";

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const { token, userId, logout } = useUser(); // Utilisation du token
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && address.trim()) {
      navigate(`/search?query=${encodeURIComponent(address)}`);
    }
  };

  // Vérification que le token est défini avant de procéder
  useEffect(() => {
    console.log("Token from context: ", token);
  }, [token]);

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
                logout(); // Déconnexion via le token
                navigate("/home");
              }}
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
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      Réglages
                    </Link>
                  </li>
                  <li>
                    <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <Link to="/publish" onClick={() => setIsMenuOpen(false)}>
                      Publier
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
