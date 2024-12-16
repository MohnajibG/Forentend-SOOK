import React, { useEffect, useState } from "react";
import axios from "axios";
import { OfferProps } from "../types/types";

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

        setOffers(response.data.offers);
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
              <p>Posté par : {offer.userId.username}</p>
              {offer.userId.avatar && (
                <img
                  src={offer.userId.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              )}
              <div>
                {offer.pictures.map((picture, index) => (
                  <img
                    key={index}
                    src={picture}
                    alt={`Offer ${offer._id} image`}
                    className="offer-image"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default OffersPage;
