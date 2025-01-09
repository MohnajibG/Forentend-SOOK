import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useCart } from "../contexts/CartContext";

import { ProfilProps } from "../../types/types";
import background from "../img/offerPage.webp";
import "../styles/offerstyle.css";
import AddToCartButton from "../components/AddToCartButton";
import Loading from "../img/Loading.gif";

const OfferPage: React.FC = () => {
  console.log("montage de OfferPage");

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

        setOffer(response.data.offer);
        console.log("Valeur de offer après setOffer :", response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'offre :", err);
        setError("Erreur lors du chargement de l'offre. Veuillez réessayer.");
      }
      setLoading(false);
    };

    fetchOffer();
  }, [id]);

  if (loading)
    return (
      <div className="Load">
        <img src={Loading} alt="" />
      </div>
    );
  if (error) return <p className="error-message">{error}</p>;
  if (!offer) return <p>Aucune offre trouvée.</p>;

  return (
    <div className="offer-page">
      <img src={background} alt="Background" className="background-img" />
      <div className="offer-container">
        <div className="offer-details">
          <h1>{offer.title || "Titre non disponible"}</h1>
          <p>Marque : {offer.brand || "Non spécifiée"}</p>
          <p>Description : {offer.description || "Non spécifiée"}</p>
          <p>Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}</p>
          <p>Taille : {offer.size || "Non spécifiée"}</p>
          <p>Couleur : {offer.color || "Non spécifiée"}</p>
          <p>Condition : {offer.condition || "Non spécifiée"}</p>
          <p>Ville : {offer.city || "Non spécifiée"}</p>
          <p>Vendeur : {offer.account?.username || "Non spécifié"}</p>
        </div>

        <div className="img-btn">
          <div className="img-offerPage">
            {offer.pictures && offer.pictures.length > 0 ? (
              offer.pictures.map((picture: string, index: number) => (
                <img
                  key={index}
                  src={picture}
                  alt={`Image ${index + 1}`}
                  style={{ maxWidth: "200px", margin: "10px" }}
                />
              ))
            ) : (
              <p>Aucune image disponible.</p>
            )}
          </div>
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
    </div>
  );
};
export default OfferPage;
