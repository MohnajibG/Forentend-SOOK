import { useState } from "react";
import { useUser } from "../contexts/UserContext"; // Importez useUser pour accéder au contexte utilisateur
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify"; // Import de react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import du CSS de react-toastify
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import login from "../assets/img/backgroudLogin.webp";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUser } = useUser(); // Utilisez useUser pour obtenir setUser depuis le contexte

  // Fonction pour afficher des notifications d'erreur avec react-toastify
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Validation simple des champs côté client
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      showErrorToast("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      showErrorToast("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }

    // Validation du mot de passe
    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit comporter au moins 8 caractères.");
      showErrorToast("Le mot de passe doit comporter au moins 8 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });
      console.log(response.data.token);

      if (response.data.token) {
        // Mettez à jour le contexte et les cookies avec les données reçues
        setUser(
          response.data.userId,
          response.data.token,
          response.data.account.username
        );

        // Vérifiez si le profil est complet
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
        showErrorToast(error.response.data.message);
      } else {
        setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
        showErrorToast("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-login">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input"
            type="email"
            id="email"
            autoComplete="email"
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
        <button className="login-btn" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
        <p className="signup-link">
          Pas encore de compte ? Créez-en un dès maintenant en cliquant ici{" "}
          <Link to="/signup">S'inscrire</Link>
        </p>
      </form>
      <img
        className="img-background"
        src={login}
        alt="image-background-signup"
      />
      {/* Affichage des erreurs via toast */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </main>
  );
};

export default Login;
