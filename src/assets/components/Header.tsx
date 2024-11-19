import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/header.css";

// Propriété attendue par le composant Header
interface HeaderProps {
  token: string | null;
  handleToken: (token: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ token, handleToken }) => {
  // Utilisation du hook useNavigate à l'intérieur du composant
  const navigate = useNavigate();

  // État pour stocker l'adresse
  const [address, setAddress] = useState("");

  return (
    <div className="header">
      <input
        className="search"
        id="search"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Entrez votre adresse"
      />
      {token ? (
        <button
          className="deconnexion"
          onClick={() => {
            handleToken(null); // Déconnexion en supprimant le token
            navigate("/");
          }}
        >
          Déconnexion
        </button>
      ) : (
        <div>
          <button onClick={() => navigate("/signup")} className="cnt-btn">
            Signup
          </button>
          <button onClick={() => navigate("/login")} className="cnt-btn">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
