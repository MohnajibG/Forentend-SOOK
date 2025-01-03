import { useState, useEffect } from "react";
import axios from "axios";
import { FormDataType } from "../../types/types";
import { useParams } from "react-router-dom"; // Pour récupérer l'ID depuis l'URL

import "../styles/offerPage.css";
import background from "../img/offerPage.webp";

const OfferPage: React.FC = () => {
  const [offer, setOffer] = useState<FormDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>(); // Récupère l'ID depuis l'URL

  useEffect(() => {
    const fetchOffer = async () => {
      console.log("id====>", id);
      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        setOffer(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'offre :", error);
        setLoading(false); // Fin du chargement
      }
    };

    fetchOffer();
  }, [id]); // Exécute l'effet uniquement lorsque l'ID change

  return (
    <div className="offer-main">
      {loading ? (
        <h2>CHARGEMENT ...</h2>
      ) : !offer ? (
        <p>Aucune offre trouvée ou erreur de chargement.</p>
      ) : (
        <>
          <h2>{offer.title}</h2>
          <img src={background} alt="Background" className="background-img" />
          <div className="offer-item">
            <h1>{offer.brand}</h1>
            <p>{offer.description}</p>
            {offer.pictures &&
            Array.isArray(offer.pictures) &&
            offer.pictures.length > 0 ? (
              offer.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={offer.pictures}
                  alt={`Offer ${index}`}
                  className="offer-image"
                />
              ))
            ) : (
              <p>Aucune image disponible pour cette offre.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferPage;
