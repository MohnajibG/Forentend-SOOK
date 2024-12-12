/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]); // Type d'offre à adapter selon votre modèle
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
        console.log("Erreur lors de la récupération des offres :", error);
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
      {error && <div>{error}</div>}
      {offers.length === 0 ? (
        <p>Soyez le premier a publier surmain SOOK.</p>
      ) : (
        <div>
          {offers.map((offer: any) => (
            <div key={offer._id}>
              <h2>{offer.title}</h2>
              <p> Description : {offer.description}</p>
              <p>Prix : {offer.price}€</p>
              <div>
                {offer.pictures.map((picture: string, index: number) => (
                  <img
                    key={index}
                    src={picture}
                    alt={`Offer ${offer._id} image`}
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
