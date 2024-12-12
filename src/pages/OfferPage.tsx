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
        const response = await axios.get("http://localhost:5000/offers");
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Toutes les offres</h1>
      {offers.length === 0 ? (
        <p>Aucune offre disponible.</p>
      ) : (
        <div>
          {offers.map((offer: any) => (
            <div key={offer._id}>
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>
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
    </div>
  );
};

export default OffersPage;
