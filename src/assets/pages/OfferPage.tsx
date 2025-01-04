import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FormDataType } from "../../types/types";
import background from "../img/offerPage.webp";

import "../styles/offerPage.css";

const OfferPage: React.FC = () => {
  const [offer, setOffer] = useState<FormDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        setOffer(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'offre :", err);
        setError("Erreur lors du chargement de l'offre. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOffer();
  }, [id]);

  const renderPictures = () => {
    if (
      offer?.pictures &&
      Array.isArray(offer.pictures) &&
      offer.pictures.length > 0
    ) {
      return offer.pictures.map((picture, index) => (
        <img
          key={index}
          src={picture}
          alt={`Offer image ${index + 1}`}
          className="offer-image"
        />
      ));
    }
    return <p>Aucune image disponible.</p>;
  };

  return (
    <div className="offer-page">
      {loading ? (
        <h2>CHARGEMENT ...</h2>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : !offer ? (
        <p>Aucune offre trouvée.</p>
      ) : (
        <div className="offer-container">
          <img src={background} alt="Background" className="background-img" />
          <div className="offer-details">
            <h1>{offer.title}</h1>
            <p>Marque : {offer.brand || "Non spécifié"}</p>
            <p>Description : {offer.description || "Non spécifiée"}</p>
            <p>Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}</p>
            <p>Taille : {offer.size || "Non spécifiée"}</p>
            <p>Couleur : {offer.color || "Non spécifiée"}</p>
            <p>Condition : {offer.condition || "Non spécifiée"}</p>
            <p>Ville : {offer.city || "Non spécifiée"}</p>

            {/* {offer.username && <p>Vendeur : {offer.username}</p>} */}
          </div>
          <div className="img-btn">
            {" "}
            <div className="offer-images">{renderPictures()}</div>
            <button>Ajouter au Panier</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferPage;
