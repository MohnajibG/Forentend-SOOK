import { useNavigate } from "react-router-dom";
import hero from "../assets/img/hero.jpg";
import "../assets/styles/home.css";
import { useUser } from "../contexts/UserContext";
import OffersPage from "./OfferPage";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useUser();

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
          <button className="home-btn" onClick={() => navigate("/publish")}>
            Publier un article
          </button>
        </div>
      ) : (
        <div className="welcom-container">
          <h2>Bienvenue!</h2>
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
      <div className="offer">
        <OffersPage />
      </div>
    </div>
  );
};

export default Home;
