import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signup from "../img/backgroundsignup.jpg";
import "../styles/signup.css";

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
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    // Validate passwords
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true); // Set loading state to true when the form is submitted

    try {
      const response = await axios.post("http://localhost:3000/user/signup", {
        username,
        email,
        password,
        confirmPassword,
        newsletter,
      });

      if (response.data.token && response.data.account.username) {
        handleToken(response.data.token);
        handleUsername(response.data.account.username);
        navigate("/profile");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false); // Set loading state to false when the request is finished
    }
  };

  return (
    <main className="main-signup">
      <img src={signup} alt="image-background-signup" />
      <h2>S'inscrire</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input"
            type="text"
            id="username"
            placeholder="Votre nom"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="Votre Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
          />
          <span
            className="toggle-visibility-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? "👁️" : "🙈"}
          </span>
        </div>
        <div className="password-input">
          <input
            className="input"
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirmer Votre Mot de passe"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <span
            className="toggle-visibility-icon"
            onClick={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            {isConfirmPasswordVisible ? "👁️" : "🙈"}
          </span>
        </div>
        <div className="checkbox-newsletter">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletter}
            onChange={() => setNewsletter(!newsletter)}
          />
          <span>S'abonner à la newsletter</span>
        </div>
        <p>
          En m'inscrivant, je confirme avoir lu et accepté les Termes &
          Conditions et Politique de Confidentialité de SOUK. Je confirme avoir
          au moins 18 ans.
        </p>
        <button disabled={isLoading}>
          {isLoading ? "Chargement..." : "S'inscrire"}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </main>
  );
};

export default Signup;
