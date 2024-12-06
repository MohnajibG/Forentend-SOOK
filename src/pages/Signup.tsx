/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useUser } from "../contexts/UserContext";

import signup from "../assets/img/backgroundsignup.jpg";

import "../assets/styles/signup.css";
import "../assets/styles/input.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup: React.FC = () => {
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

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValidEmail) {
      setErrorMessage("Email invalide.");
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/user/signup",
        {
          username,
          email,
          password,
          confirmPassword,
          newsletter,
        }
      );

      if (response.data.token && response.data.account.username) {
        const { token, userId } = response.data;
        const username = response.data.account.username;

        setUser(userId, token, username);

        navigate(`/profileUpdate/${userId}`);
      } else {
        setErrorMessage("Erreur inattendue lors de l'inscription.");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-signup">
      <img src={signup} alt="image-background-signup" />
      <h2>S'inscrire</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          placeholder="Votre nom"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isLoading}
        />

        <input
          type="email"
          id="email"
          placeholder="Votre Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
        />

        <input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="Votre Mot de passe"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
        />
        <span
          className="toggle-visibility-icon-password "
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </span>

        <input
          type={isConfirmPasswordVisible ? "text" : "password"}
          id="confirmPassword"
          placeholder="Confirmer Votre Mot de passe"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={isLoading}
        />
        <span
          className="toggle-visibility-icon-confirmPassword "
          onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
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
          En m'inscrivant, je certifie avoir pris connaissance et accepté les
          Termes et Conditions ainsi que la Politique de Confidentialité de{" "}
          <span>SOUK!</span>. Je déclare également avoir au moins 18 ans.
        </p>

        {/* Affichage du bouton ou du spinner */}
        <button disabled={isLoading}>
          {isLoading ? (
            <ClipLoader size={20} color="#fff" loading={isLoading} />
          ) : (
            "S'inscrire"
          )}
        </button>
        <p className="signup-link">
          vous avez déja un compte? connectez vous ici{" "}
          <Link to="/login">Se connecter</Link>
        </p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </main>
  );
};

export default Signup;
