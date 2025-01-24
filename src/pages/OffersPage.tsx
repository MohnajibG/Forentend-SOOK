import axios from "axios";

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { ProfilProps } from "../types/types";

import backgroundPage from "../img/hero.jpg";
import LOGO from "../img/LOGO.png";

import "../styles/offerspage.css";

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<ProfilProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );

        setOffers(response.data.offers || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
        setError("Impossible de charger les offres.");
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return loading ? (
    <main className="offer-main">Chargement...</main>
  ) : (
    <main className="offer-main">
      <img
        className="background-img"
        src={backgroundPage}
        alt="image background"
      />
      {error && <div className="error-message">{error}</div>}
      {offers.length === 0 ? (
        <p>Soyez le premier à publier sur SOOK.</p>
      ) : (
        <div className="offers">
          {offers.map((offer) => (
            <div>
              <Link to={`/offer/${offer._id}`} className="offer-link">
                <div key={offer._id} className="offer-item">
                  <h2>{offer.title}</h2>
                  <p>{offer.price}€</p>

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
                </div>
              </Link>
              <div className="username-avatar">
                {offer.userId.account ? (
                  <p>
                    {offer.userId.account?.username
                      ? offer.userId.account.username.charAt(0).toUpperCase() +
                        offer.userId.account.username.slice(1)
                      : "Non spécifié"}
                  </p>
                ) : (
                  <p>Utilisateur inconnu</p>
                )}
                {offer.userId.account?.avatar ? (
                  <img
                    src={offer.userId.account.avatar}
                    alt="Avatar"
                    className="avatar"
                  />
                ) : (
                  <img src={LOGO} alt="avatar" className="avatar" />
                )}
              </div>{" "}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default OffersPage;
