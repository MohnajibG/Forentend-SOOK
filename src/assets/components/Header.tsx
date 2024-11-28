import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/LOGO.png";
import { CgProfile } from "react-icons/cg";

import "../styles/header.css";

interface HeaderProps {
  token: string | null;
  handleToken: (token: string | null) => void;
  userId: string | null; // Ajout pour récupérer l'ID utilisateur
}

const Header: React.FC<HeaderProps> = ({ token, handleToken, userId }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  // const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     console.log("Recherche déclenchée pour :", address);
  //     navigate(`/search?query=${encodeURIComponent(address)}`);
  //   }
  // };

  return (
    <div className="header">
      <Link to="/home" aria-label="Retour à la page d'accueil">
        <img src={logo} alt="Le logo de Sook!" />
      </Link>

      <div className="header-inpt-btn">
        <input
          className="search"
          id="search"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          // onKeyDown={handleSearch}
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

            <Link to="/home">
              <div className="profileUpdate-icon">
                <CgProfile />
              </div>
            </Link>
          </div>
        ) : (
          <div className="header-btn">
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
