import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/LOGO.png";
import { CgProfile } from "react-icons/cg";
import "../styles/header.css";

// Propriétés attendues par le composant Header
interface HeaderProps {
  token: string | null;
  handleToken: (token: string | null) => void;
  userId: string | null; // Ajout du userId
}

const Header: React.FC<HeaderProps> = ({ token, handleToken, userId }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gestion de l'ouverture/fermeture du menu burger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction de recherche si nécessaire
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Recherche déclenchée pour :", address);
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
                handleToken(null);
                navigate("/home");
              }}
              aria-label="Bouton de déconnexion"
            >
              Déconnexion
            </button>

            {/* Icône de profil qui ouvre le menu burger */}
            <div className="profileUpdate-icon" onClick={toggleMenu}>
              <CgProfile />
            </div>

            {/* Affichage du menu burger si isMenuOpen est vrai */}
            {isMenuOpen && (
              <div className="burger-menu">
                <ul>
                  <li>
                    <Link
                      to={`/${userId}/profile`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                  </li>
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
