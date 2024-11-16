import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/header.css";

const Header = () => {
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
      <button onClick={() => navigate("/signup")} className="cnt-btn">
        Signup
      </button>
      <button onClick={() => navigate("/login")} className="cnt-btn">
        Login
      </button>
    </div>
  );
};

export default Header;
