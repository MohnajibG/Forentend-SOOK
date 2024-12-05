import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import hero from "../assets/img/hero.jpg";
import "../assets/styles/home.css";
import { useUser } from "../contexts/UserContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username, token } = useUser();

  useEffect(() => {
    if (!username) {
      const storedUsername = Cookies.get("username");
      if (storedUsername) {
        console.log("Username récupéré depuis les cookies:", storedUsername);
      } else {
        console.log("Aucun username trouvé dans les cookies.");
      }
    }
  }, [username, token]);

  return (
    <div className="home-container">
      <h1>
        <span className="left-bar">|</span>
        SOOK !<span className="right-bar">|</span>
      </h1>
      <div className="hero">
        <img src={hero} alt="image hero" />
      </div>
      {username ? (
        <div className="welcom-container">
          <h2>
            Bonjour,{" "}
            {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}{" "}
            !
          </h2>
          <p>Merci de vous être connecté. Profitez de nos fonctionnalités !</p>
          {/* Modification ici pour la navigation */}
          <button className="home-btn" onClick={() => navigate("/publish")}>
            Publier un article
          </button>
        </div>
      ) : (
        <div className="welcom-container">
          <h2>Bienvenue visiteur !</h2>
          <p>Pour accéder à plus de fonctionnalités, veuillez </p>
          <div>
            <button className="home-btn" onClick={() => navigate("/login")}>
              Se connecter
            </button>
            <span>ou</span>
            <button className="home-btn" onClick={() => navigate("/signup")}>
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
