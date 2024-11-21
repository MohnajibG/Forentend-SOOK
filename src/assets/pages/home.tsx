import { useNavigate } from "react-router-dom";
import hero from "../img/hero.jpg";
import "../styles/home.css";

interface HomeProps {
  username: string | null;
  token: string | null;
}

const Home: React.FC<HomeProps> = ({ username, token }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre application !</h1>
      <div className="hero">
        <img src={hero} alt="image hero" />
      </div>
      {token && username ? (
        <div className="welcom-container">
          <h2>Bonjour, {username} !</h2>
          <p>Merci de vous être connecté. Profitez de nos fonctionnalités !</p>
        </div>
      ) : (
        <div className="welcom-container">
          <h2>Bienvenue visiteur !</h2>
          <p>
            Pour accéder à plus de fonctionnalités, veuillez{" "}
            <button className="home-btn" onClick={() => navigate("/login")}>
              vous connecter
            </button>
            ou
            <button className="home-btn" onClick={() => navigate("/signup")}>
              créer un compte
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
