import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useUser } from "../contexts/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import signupBackground from "../assets/img/backgroundsignup.jpg";

import "../assets/styles/signup.css";
import "../assets/styles/input.css";

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
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
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

        Cookies.set("token", token, { expires: 1 }); // Token valable 1 jour
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
    <main className="main-signup">
      <img src={signupBackground} alt="Background signup" />
      <h2>S'inscrire</h2>

      <form onSubmit={handleSubmit}>
        {/* Affichage des erreurs */}
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <p className="error-message" key={index}>
                {error}
              </p>
            ))}
          </div>
        )}

        <input
          type="text"
          id="username"
          placeholder="Votre nom"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />

        <input
          type="email"
          id="email"
          placeholder="Votre Email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />

        {/* Mot de passe */}
        <div className="password-field">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Votre Mot de passe"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span
            className="toggle-visibility-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Confirmation mot de passe */}
        <div className="password-field">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirmer votre mot de passe"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span
            className="toggle-visibility-icon"
            onClick={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            {isConfirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Newsletter */}
        <div className="nl-container">
          <input
            className="checkbox-newsletter"
            type="checkbox"
            id="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            disabled={isLoading}
          />
          <span>S'abonner à la newsletter</span>
        </div>

        {/* Terms and conditions */}
        <p>
          En m'inscrivant, je certifie avoir pris connaissance et accepté les
          Termes et Conditions ainsi que la Politique de Confidentialité de{" "}
          <span>SOOK!</span>. Je déclare également avoir au moins 18 ans.
        </p>

        {/* Bouton s'inscrire */}
        <button disabled={isLoading}>
          {isLoading ? (
            <ClipLoader size={20} color="#fff" loading={isLoading} />
          ) : (
            "S'inscrire"
          )}
        </button>

        {/* Lien connexion */}
        <p className="signup-link">
          Vous avez déjà un compte ? Connectez-vous ici{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
