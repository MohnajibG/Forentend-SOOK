import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../assets/img/backgroudLogin.webp";
import Cookies from "js-cookie";
import "../assets/styles/login.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify"; // Import de react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import du CSS de react-toastify
import { Link } from "react-router-dom";

interface LoginProps {
  setUser: (userId: string, token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fonction pour afficher des notifications d'erreur avec react-toastify
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right", // Utilisation d'une chaîne de caractères pour la position
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

    // Validation basique de l'email (tu pourrais aller plus loin si nécessaire)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      showErrorToast("Veuillez entrer un email valide.");
      setIsLoading(false);
      return;
    }

    // Validation du mot de passe (minimum 6 caractères)
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

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 45 });

        if (response.data.account.username) {
          Cookies.set("username", response.data.account.username, {
            expires: 45,
          });
        }
        if (response.data.userId) {
          Cookies.set("userId", response.data.userId, { expires: 1 });
        }

        const userId = response.data.userId;
        const username = response.data.account.username;

        setUser(userId, response.data.token, username);

        navigate(`/${userId}/profilePage`);
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
