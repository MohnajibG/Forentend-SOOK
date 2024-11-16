import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const Signup = () => {
  // State management for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmePassword, setConfirmePassword] = useState("");

  // State management for newsletter and error messages
  const [newsletter, setNewsletter] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    console.log({ username, email, password, confirmePassword, newsletter }); // Afficher les données envoyées
    try {
      const response = await axios.post("http://localhost:3000/user/signup", {
        username,
        email,
        password,
        confirmePassword,
        newsletter,
      });

      if (response.data.token && response.data.account.username) {
        navigate("/profile"); // Redirection vers la page d'accueil après l'inscription
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message); // Affiche le message d'erreur renvoyé par le serveur
      } else {
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <main className="main-signup">
      <h2>S'inscrire</h2>
      {/* Display error message if any */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input"
            type="text"
            id="username"
            placeholder="Votre nom"
            value={username}
            onChange={(event) => setUsername(event.target.value)} // Update state when user types
          />
        </div>
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
        <div>
          <input
            className="input"
            type="password"
            id="password"
            placeholder="Votre Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)} // Update state when user types
          />
        </div>
        <div>
          <input
            className="input"
            type="password"
            id="confirmePassword"
            placeholder="Confirmer Votre Mot de passe"
            value={confirmePassword}
            onChange={(event) => setConfirmePassword(event.target.value)} // Update state when user types
          />
        </div>
        <div className="chechbox-newsletter">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletter}
            onChange={() => setNewsletter(!newsletter)} // Toggle newsletter subscription state
          />
          <span>S'abonner à la newsletter</span>
        </div>
        <p>
          En m'inscrivant je confirme avoir lu et accepté les Termes &
          Conditions et Politique de Confidentalité de Vinted. Je confirme avoir
          au moins 18 ans
        </p>
        <button>S'inscrire</button> {/* Submit button */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </main>
  );
};

export default Signup;
