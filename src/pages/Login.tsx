/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import "../assets/styles/login.css";
import "../assets/styles/input.css";

import loginBackground from "../assets/img/backgroudLogin.webp";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Validation client simple
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    // Vérification du format de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit comporter au moins 8 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/user/login",
        { email, password }
      );

      if (response.data.token) {
        setUser(
          response.data.userId,
          response.data.token,
          response.data.account.username
        );

        // Vérifier si le profil est complet
        const isProfileComplete =
          response.data.account.sexe &&
          response.data.account.address &&
          response.data.account.phoneNumber;

        // Redirection en fonction de l'état du profil
        if (isProfileComplete) {
          navigate(`/profilePage/${response.data.userId}`);
        } else {
          navigate(`/profileUpdate/${response.data.userId}`);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-login">
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        {/* Champ Email */}
        <div>
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="password-input">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
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

        {/* Bouton de connexion */}
        <button className="login-btn" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>

        {/* Lien vers l'inscription */}
        <p className="signup-link">
          Pas encore de compte ? Créez-en un dès maintenant en cliquant ici{" "}
          <Link to="/signup">S'inscrire</Link>
        </p>
      </form>

      {/* Image de fond */}
      <img
        className="img-background"
        src={loginBackground}
        alt="image-background-signup"
      />

      {/* Message d'erreur */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </main>
  );
};

export default Login;
