import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  // State management for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State management for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // State management for error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    console.log({ email, password }); // Afficher les données envoyées
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        navigate("/profile"); // Redirection vers la page de profil après le login
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message); // Affiche le message d'erreur renvoyé par le serveur
      } else {
        setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
      }
    }
  };

  // useEffect to toggle password visibility based on state
  useEffect(() => {
    // This effect can be used if you want to trigger actions when visibility state changes
  }, [isPasswordVisible]);

  return (
    <main className="main-login">
      <h2>Connexion</h2>
      {/* Display error message if any */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="Votre Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)} // Update state when user types
          />
        </div>
        <div className="password-input">
          <input
            className="input"
            type={isPasswordVisible ? "text" : "password"} // Toggle input type based on visibility state
            id="password"
            placeholder="Votre Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)} // Update state when user types
          />
          {/* Icon to toggle visibility */}
          <span
            className="toggle-visibility-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? "👁️" : "🙈"}
          </span>
        </div>
        <button>Se connecter</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </main>
  );
};

export default Login;
