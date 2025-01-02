import React, { useEffect, useState } from "react";
import axios from "axios";
import { OfferProps } from "../../types/types";
import "../styles/offerpage.css";
import backgroundPage from "../img/hero.jpg";

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<OfferProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );

        setOffers(response.data.offers || []); // Gérer le cas où "offers" est undefined
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
        <div>
          {offers.map((offer) => (
            <div key={offer._id} className="offer-item">
              <h2>{offer.title}</h2>
              <p>Description : {offer.description}</p>
              <p>Prix : {offer.price}€</p>
              {/* Vérifie si userId et username existent avant d'afficher */}
              {offer.userId ? (
                <p>Posté par : {offer.userId.username}</p>
              ) : (
                <p>Utilisateur inconnu</p>
              )}
              {/* Vérifie et affiche l'avatar de l'utilisateur s'il existe */}
              {offer.userId?.avatar && (
                <img
                  src={offer.userId.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              )}
              {/* Vérifie si des images sont disponibles pour l'offre */}
              {offer.pictures?.length > 0 && (
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
          ))}
        </div>
      )}
    </main>
  );
};

export default OffersPage;
