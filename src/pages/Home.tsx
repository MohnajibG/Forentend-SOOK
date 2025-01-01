import { useNavigate } from "react-router-dom";
import hero from "../assets/img/hero.jpg";
import "../assets/styles/home.css";
import { useUser } from "../contexts/UserContext";
// import OffersPage from "./OfferPage";

import { HeaderProps, OfferProps } from "../types/types";
import { Key, useEffect, useState } from "react";

const Home: React.FC<HeaderProps> = ({ search }) => {
  const [data, setData] = useState<{ offers: OfferProps[] }>({ offers: [] });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { username } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://site--sook--dnxhn8mdblq5.code.run/offers?title=${search}`
        );
        const result = await response.json();
        console.log(result);

        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [search]);

  return isLoading ? (
    <p>Loading ...</p>
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
      <div className="offer">
        <div>
          {data.offers.map((offer) => (
            <div key={offer._id} className="offer-item">
              <h2>{offer.title}</h2>
              <p>Description : {offer.description}</p>
              <p>Prix : {offer.price}€</p>
              {offer.userId ? (
                <p>Posté par : {offer.userId.username}</p>
              ) : (
                <p>Utilisateur inconnu</p>
              )}
              {offer.userId?.avatar && (
                <img
                  src={offer.userId.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              )}
              {offer.pictures?.length > 0 && (
                <div className="pictures-offer">
                  {offer.pictures.map(
                    (
                      picture: string | undefined,
                      index: Key | null | undefined
                    ) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
