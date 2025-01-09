import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero from "../img/hero.jpg";
import "../styles/home.css";
import { useUser } from "../contexts/UserContext";
import { ProfilProps } from "../../types/types";

const Home: React.FC = () => {
  const [data, setData] = useState<{ offers: ProfilProps[] }>({ offers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { username } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );
        setData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur est survenue lors du chargement des offres.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <div className="hero">
        <img src={hero} alt="Hero" />
      </div>
      <div className="home-container">
        <div className="home-page-title">
          <h1>
            <span className="left-bar">|</span>
            SOOK !<span className="right-bar">|</span>
          </h1>
        </div>

        {username ? (
          <div className="welcom-container">
            <h2>
              Bonjour,{" "}
              {username.charAt(0).toUpperCase() +
                username.slice(1).toLowerCase()}
              !
            </h2>
            <p>
              Merci de vous être connecté. Profitez de nos fonctionnalités !
            </p>
            <button className="home-btn" onClick={() => navigate("/publish")}>
              Publier un article
            </button>
          </div>
        ) : (
          <div className="welcom-container">
            <h2>Bienvenue!</h2>
            <p>Pour accéder à plus de fonctionnalités, veuillez :</p>
            <div>
              <button className="home-btn" onClick={() => navigate("/login")}>
                Se connecter
              </button>
              <span> ou </span>
              <button className="home-btn" onClick={() => navigate("/signup")}>
                S'inscrire
              </button>
            </div>
          </div>
        )}
        <div className="offer-home">
          {data.offers.map((offer) => (
            <div key={offer._id} className="offer-item">
              <h2>{offer.title}</h2>
              <p>Prix : {offer.price}€</p>
              {offer.account?.username ? (
                <p>Posté par : {offer.account.username}</p>
              ) : (
                <p>Utilisateur inconnu</p>
              )}
              {offer.account?.avatar && (
                <img
                  src={offer.account.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              )}
              {offer.pictures && offer.pictures.length > 0 && (
                <div className="pictures-offer">
                  {offer.pictures.map((picture, index) => (
                    <img
                      key={index}
                      src={picture}
                      alt={`Image de l'offre ${offer._id}`}
                      className="offer-image"
                    />
                  ))}
                </div>
              )}
              <Link to={`/offer/${offer._id}`}>
                <button>Voir l'offre</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
