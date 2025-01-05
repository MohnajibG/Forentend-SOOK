import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useCart } from "../contexts/CartContext";

import { ProfilProps } from "../../types/types";
import background from "../img/offerPage.webp";
import "../styles/offerstyle.css";
import AddToCartButton from "../components/AddToCartButton";

const OfferPage: React.FC = () => {
  const [offer, setOffer] = useState<ProfilProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        console.log("Réponse de l'API :", response.data);

        setOffer(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'offre :", err);
        setError("Erreur lors du chargement de l'offre. Veuillez réessayer.");
      }
      setLoading(false);
    };

    fetchOffer();
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

            {/* Correction de l'affichage du nom du vendeur */}
            <p>Vendeur : {offer.account?.username || "lenom"}</p>
          </div>
          <div className="img-btn">
            <div className="offer-images">{renderPictures()}</div>
            <AddToCartButton
              cart={cart}
              setCart={setCart}
              item={{
                id: offer._id || "",
                name: offer.title || "",
                price: offer.price || 0,
                // quantity: 0,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferPage;
