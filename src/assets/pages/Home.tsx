import axios from "axios";
import { useNavigate } from "react-router-dom";

import hero from "../img/hero.jpg";

import "../styles/home.css";

import { useUser } from "../contexts/UserContext";

import { OfferProps } from "../../types/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [data, setData] = useState<{ offers: OfferProps[] }>({ offers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { username } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before starting new fetch
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );
        setData(response.data); // Assuming the response structure matches { offers: [] }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError("Une erreur est survenue lors du chargement des offres.");
        setData({ offers: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return isLoading ? (
    <p>Loading ...</p>
  ) : error ? (
    <p>{error}</p> // Display error message if there's an issue with fetching data
  ) : (
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
            Bonjour,
            {username.charAt(0).toUpperCase() +
              username.slice(1).toLowerCase()}{" "}
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
      <div className="offer-home">
        {data.offers.map((offer) => (
          <div key={offer._id} className="offer-item">
            <h2>{offer.title}</h2>
            <p>Prix : {offer.price}€</p>
            {offer.userId ? (
              <p>Posté par : {offer.userId.username}</p>
            ) : (
              <p>Utilisateur inconnu</p>
            )}
            {offer.userId?.avatar && (
              <img src={offer.userId.avatar} alt="Avatar" className="avatar" />
            )}
            {offer.pictures?.length > 0 && (
              <div className="pictures-offer">
                {offer.pictures.map(
                  (picture: string | undefined, index: number) => (
                    <img
                      key={index}
                      src={picture}
                      alt={`Image de l'offre ${offer._id}`}
                      className="offer-image"
                    />
                  )
                )}
              </div>
            )}
            <Link to={`/offer/${offer._id}`}>
              <button> Voir l'offre</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
