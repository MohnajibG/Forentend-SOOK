import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signup from "../img/backgroundsignup.jpg";
import Cookies from "js-cookie";

import "../styles/signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importation des icônes Font Awesome

type SignupProps = {
  handleToken: (token: string | null) => void;
  handleUsername: (username: string | null) => void;
};

const Signup: React.FC<SignupProps> = ({ handleToken, handleUsername }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/user/signup", {
        username,
        email,
        password,
        confirmPassword,
        newsletter,
      });

      if (response.data.token && response.data.account.username) {
        handleToken(response.data.token); // Stocke le token
        handleUsername(response.data.account.username); // Stocke le nom d'utilisateur
        console.log("Token stocké:", Cookies.get("token")); // Vérifie le cookie

        // Redirige vers la page profil avec l'ID de l'utilisateur
        navigate(`/profile/${response.data.account.userId}`);
      } else {
        setErrorMessage("Erreur inattendue lors de l'inscription.");
      }
    } catch (err: any) {
      // Vérifie si le message d'erreur existe
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false); // Réinitialise l'état de chargement
    }
  };

  return (
    <main className="main-signup">
      <img src={signup} alt="image-background-signup" />
      <h2>S'inscrire</h2>
      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            id="username"
            placeholder="Votre nom"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={isLoading}
          />

          <input
            className="input"
            type="email"
            id="email"
            placeholder="Votre Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading}
          />

          <input
            className="input"
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Votre Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
          />
          <span
            className="toggle-visibility-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}{" "}
            {/* Icônes de visibilité de mot de passe */}
          </span>

          <input
            className="input"
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirmer Votre Mot de passe"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isLoading}
          />
          <span
            className="toggle-visibility-icon"
            onClick={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}{" "}
            {/* Icônes de visibilité de mot de passe */}
          </span>

          <div className="nl-countainer">
            <input
              className="checkbox-newsletter"
              type="checkbox"
              id="newsletter"
              checked={newsletter}
              onChange={() => setNewsletter(!newsletter)}
              disabled={isLoading}
            />

            <span>S'abonner à la newsletter</span>
          </div>

          <p>
            En m'inscrivant, je confirme avoir lu et accepté les Termes &
            Conditions et Politique de Confidentialité de <span>SOUK!</span>. Je
            confirme avoir au moins 18 ans.
          </p>
          <button disabled={isLoading}>
            {isLoading ? "Chargement..." : "S'inscrire"}
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </main>
  );
};

export default Signup;
