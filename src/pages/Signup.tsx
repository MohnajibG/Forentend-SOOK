import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useUser } from "../contexts/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import signupBackground from "../assets/img/backgroundsignup.jpg";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validateInputs = (): boolean => {
    const newErrors: string[] = [];

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      newErrors.push("Tous les champs sont requis.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.push("L'email est invalide.");
    }

    if (formData.password.length < 6) {
      newErrors.push("Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (!/[A-Z]/.test(formData.password)) {
      newErrors.push(
        "Le mot de passe doit contenir au moins une lettre majuscule."
      );
    }
    if (!/[a-z]/.test(formData.password)) {
      newErrors.push(
        "Le mot de passe doit contenir au moins une lettre minuscule."
      );
    }
    if (!/[0-9]/.test(formData.password)) {
      newErrors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
      newErrors.push(
        "Le mot de passe doit contenir au moins un caractère spécial."
      );
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Les mots de passe ne correspondent pas.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/user/signup",
        formData
      );

      if (response.data.token && response.data.account.username) {
        const { token, userId } = response.data;
        const username = response.data.account.username;

        Cookies.set("token", token, { expires: 1 });
        setUser(userId, token, username);
        navigate(`/profileUpdate/${userId}`);
      } else {
        setErrors(["Erreur inattendue lors de l'inscription."]);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErrors(
          Array.isArray(err.response.data.message)
            ? err.response.data.message
            : [err.response.data.message]
        );
      } else {
        setErrors(["Erreur lors de l'inscription. Veuillez réessayer."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen text-white  my-15 pt-20 pb-40
        font-[Space Grotesk] flex flex-col justify-center items-center gap-20
      "
    >
      {/* Background image plein écran, fixé */}
      <img
        src={signupBackground}
        alt="Background signup"
        className="fixed inset-0 -z-10 h-screen w-full object-cover"
      />

      <h2 className="text-center text-2xl drop-shadow-[0_0_20px_rgba(252,124,124,0.8)]">
        S&apos;inscrire
      </h2>

      <form
        onSubmit={handleSubmit}
        className="
          flex flex-col items-center justify-center gap-5
          w-full max-w-sm
        "
      >
        {/* Erreurs */}
        {errors.length > 0 && (
          <div className="w-full">
            {errors.map((error, i) => (
              <p
                key={i}
                className="
                  text-red-500 p-4 bg-red-500/20 text-center text-sm mt-4 font-bold
                  drop-shadow-[0_0_10px_rgba(0,0,0,1)] shadow-[0_0_10px_rgba(0,0,0,1)]
                  rounded
                "
              >
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          id="username"
          placeholder="Votre nom"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          className="
            w-full h-12 rounded border border-white/20 bg-white/90 text-black
            placeholder-black/60 px-4 outline-none
            hover:bg-white/95 transition
          "
        />

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Votre Email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="
            w-full h-12 rounded border border-white/20 bg-white/90 text-black
            placeholder-black/60 px-4 outline-none
            hover:bg-white/95 transition
          "
        />

        {/* Mot de passe */}
        <div className="relative w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Votre Mot de passe"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="
              w-full h-12 rounded border border-white/20 bg-white/90 text-black
              placeholder-black/60 px-4 pr-10 outline-none
              hover:bg-white/95 transition
            "
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-black text-xl cursor-pointer select-none
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

        {/* Confirmation mot de passe */}
        <div className="relative w-full">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirmer votre mot de passe"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className="
              w-full h-12 rounded border border-white/20 bg-white/90 text-black
              placeholder-black/60 px-4 pr-10 outline-none
              hover:bg-white/95 transition
            "
          />
          <button
            type="button"
            onClick={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-black text-xl cursor-pointer select-none
            "
            aria-label={
              isConfirmPasswordVisible
                ? "Masquer la confirmation"
                : "Afficher la confirmation"
            }
          >
            {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {/* Newsletter */}
        <label
          htmlFor="newsletter"
          className="
            mt-4 flex items-center gap-3 font-bold text-[rgba(223,160,128,0.74)]
          "
        >
          <input
            className="w-4 h-4 accent-[rgba(223,160,128,0.74)]"
            type="checkbox"
            id="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span>S&apos;abonner à la newsletter</span>
        </label>

        {/* Terms */}
        <p className="w-72 font-bold text-base text-white text-justify">
          En m&apos;inscrivant, je certifie avoir pris connaissance et accepté
          les Termes et Conditions ainsi que la Politique de Confidentialité de{" "}
          <span className="text-[#300a22] font-bold">SOOK!</span>. Je déclare
          également avoir au moins 18 ans.
        </p>

        {/* Bouton */}
        <button
          disabled={isLoading}
          className="
            mt-4 h-12 w-full
            bg-[#dfa080bd] hover:bg-[#c87660]
            text-white font-bold text-xl
            rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <ClipLoader size={20} color="#fff" loading={isLoading} />
          ) : (
            "S'inscrire"
          )}
        </button>

        {/* Lien connexion */}
        <p className="w-72 font-bold text-base text-white text-justify">
          Vous avez déjà un compte ? Connectez-vous ici{" "}
          <Link to="/login" className="underline underline-offset-2">
            Se connecter
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
