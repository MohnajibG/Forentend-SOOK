import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../img/backgroudLogin.webp"; // Ajoute une image de fond pour la page login
import Cookies from "js-cookie";
import "../styles/login.css"; // Réutilise le même fichier CSS pour garder une cohérence de style

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

interface LoginProps {
  handleToken: (token: string | null) => void;
  handleUsername: (username: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ handleToken, handleUsername }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Indique que le chargement commence

    // Validation simple des champs
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Enregistre le token dans les cookies
        Cookies.set("token", response.data.token);
        handleToken(response.data.token);

        // Enregistre le nom d'utilisateur si nécessaire
        if (response.data.account.username) {
          Cookies.set("username", response.data.account.username);
          handleUsername(response.data.account.username);
        }

        // Récupère le userId pour la navigation
        const userId = response.data.userId;

        // Redirige vers la page profil après la connexion
        navigate(`/profile/${userId}`);
      }
    } catch (error: any) {
      // Gestion des erreurs
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  return (
    <main className="main-login">
      <h2>Connexion</h2>
      <div className="login-countiner">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input"
              type="email"
              id="email"
              placeholder="Votre Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="password-input">
            <input
              className="input"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Votre Mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <span
              className="toggle-visibility-icon"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button className="login-btn" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
      <img
        className="img-background"
        src={login}
        alt="image-background-signup"
      />
    </main>
  );
};

export default Login;
