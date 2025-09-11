/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { GoogleLogin } from "@react-oauth/google";

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

    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }

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

        const isProfileComplete =
          response.data.account.sexe &&
          response.data.account.address &&
          response.data.account.phoneNumber;

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
    <main
      className="
        relative min-h-screen pt-20 pb-24
        text-white font-[Krub] flex flex-col justify-center items-center gap-20
      "
    >
      {/* Image de fond plein écran, fixée */}
      <img
        className="fixed inset-0 -z-10 h-screen w-full object-cover"
        src={loginBackground}
        alt="image-background-signup"
      />

      <h2 className="text-center text-2xl drop-shadow-[0_0_20px_rgba(252,124,124,0.8)]">
        Connexion
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-5 w-full max-w-sm"
      >
        {/* Champ Email */}
        <div className="w-full">
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="
              w-full h-12 rounded border border-white/20
              bg-white/90 text-black placeholder-black/60
              px-4 outline-none hover:bg-white/90 md:hover:bg-white/95 transition
            "
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="relative w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="
              w-full h-12 rounded border border-white/20
              bg-white/90 text-black placeholder-black/60
              px-4 pr-10 outline-none hover:bg-white/95 transition
            "
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-[#292727] text-xl cursor-pointer select-none
            "
            aria-label={
              isPasswordVisible
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <div className="mt-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                // envoyer le token Google à ton backend
                const res = await axios.post(
                  "https://site--sook--dnxhn8mdblq5.code.run/user/google-login",
                  { token: credentialResponse.credential }
                );

                if (res.data.token) {
                  setUser(
                    res.data.userId,
                    res.data.token,
                    res.data.account.username
                  );
                  navigate(`/profilePage/${res.data.userId}`);
                }
              } catch (err) {
                setErrorMessage("Erreur de connexion Google.");
              }
            }}
            onError={() => {
              setErrorMessage("Échec de la connexion Google");
            }}
          />
        </div>

        {/* Bouton de connexion */}
        <button
          className="
            w-40 h-12 text-white font-bold
            bg-[#dfa080ec] hover:bg-[#cf8860]
            text-base md:text-lg rounded
            transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          "
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>

        {/* Lien vers l'inscription */}
        <p className="w-72 font-bold text-base text-white text-justify">
          Pas encore de compte ? Créez-en un dès maintenant en cliquant ici{" "}
          <Link
            to="/signup"
            className="font-semibold no-underline text-[#dfa080bd] hover:text-[#d6390d]
                       transition-colors [text-shadow:2px_2px_5px_rgb(17,2,2)]
                       hover:[text-shadow:2px_2px_10px_rgb(246,246,246)]"
          >
            S'inscrire
          </Link>
        </p>
      </form>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="text-red-500 text-center text-sm mt-4 font-bold drop-shadow-[0_0_10px_#fff]">
          {errorMessage}
        </div>
      )}
    </main>
  );
};

export default Login;
