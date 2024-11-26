import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/LOGO.png";

import "../styles/header.css";

// Propriété attendue par le composant Header
interface HeaderProps {
  token: string | null;
  handleToken: (token: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ token, handleToken }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Effectuer l'action de recherche avec la valeur 'address'
      console.log("Recherche déclenchée pour :", address);
      // Optionnel : naviguer vers une page de résultats de recherche ou appeler une fonction de recherche
      // navigate(`/search?query=${address}`);
    }
  };

  return (
    <div className="header">
      <Link to="/home">
        <img src={logo} alt="le logo de sook!" />
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
          <button
            className="deconnexion"
            onClick={() => {
              handleToken(null);
              navigate("/");
            }}
            aria-label="Bouton de déconnexion"
          >
            Déconnexion
          </button>
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
