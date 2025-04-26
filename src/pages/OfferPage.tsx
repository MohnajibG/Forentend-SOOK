import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProfilProps } from "../types/types";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import "../assets/styles/offerstyle.css";
import "../assets/styles/button.css";

import AddToCartButton from "../components/AddToCartButton";
import Modal from "../components/Modal";

import background from "../assets/img/offerPage.webp";

const OfferPage: React.FC = () => {
  const [offer, setOffer] = useState<ProfilProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!id) {
      navigate("/offers");
      return;
    }

    const fetchOffer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        setOffer(response.data.offer);
      } catch (err: any) {
        setError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Erreur lors du chargement de l'offre. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, navigate]);

  const handleAddToCartSuccess = () => {
    toast.success("Produit ajouté au panier !");
  };

  if (loading)
    return (
      <div className="Load">
        <ClipLoader size={50} color="#f10303" loading={loading} />
      </div>
    );

  if (error) return <p className="error-message">{error}</p>;
  if (!offer) return <p>Aucune offre trouvée.</p>;

  return (
    <div className="offer-page">
      <img src={background} alt="Background" className="background-img" />
      <div className="offer-container">
        <div className="offer-user-info">
          <p className="username-offer">
            {offer.userId.account?.username.toUpperCase() || "Non spécifié"}
          </p>
          <img
            src={offer.userId.account?.avatar || ""}
            alt="avatar"
            className="offer-user-info-img"
          />
        </div>

        <div className="offer">
          <div className="offer-details">
            <div
              className="title-details-offer"
              onClick={() => setShowDetailsModal(true)}
            >
              <h1>{offer.title || "Titre non disponible"}</h1>
              <p>Marque : {offer.brand || "Non spécifiée"}</p>
              <p>Description : {offer.description || "Non spécifiée"}</p>
              <p>Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}</p>
              <p>Taille : {offer.size || "Non spécifiée"}</p>
              <p>Couleur : {offer.color || "Non spécifiée"}</p>
            </div>
          </div>

          <div className="img-btn">
            <div
              className="img-offerPage"
              onClick={() => setShowImagesModal(true)}
            >
              {offer.pictures && offer.pictures.length > 0 ? (
                offer.pictures.map((picture: string, index: number) => (
                  <Link to={picture} key={index}>
                    <img
                      src={picture}
                      alt={`Image ${index + 1}`}
                      className="img-offer"
                    />
                  </Link>
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
              }}
              token={token || ""}
              userId={offer.userId._id}
              onSuccess={handleAddToCartSuccess}
            />
          </div>
        </div>

        {/* Bouton Retour */}
        <div className="return-button-container">
          <button className="return-button" onClick={() => navigate("/offers")}>
            ← Retour aux Offres
          </button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <h2>Détails de l'offre</h2>
          <p>Marque : {offer.brand || "Non spécifiée"}</p>
          <p>Description : {offer.description || "Non spécifiée"}</p>
          <p>Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}</p>
          <p>Taille : {offer.size || "Non spécifiée"}</p>
          <p>Couleur : {offer.color || "Non spécifiée"}</p>
          <p>Condition : {offer.condition || "Non spécifiée"}</p>
          <p>Ville : {offer.city || "Non spécifiée"}</p>
        </Modal>
      )}

      {/* Modal Images */}
      {showImagesModal && (
        <Modal onClose={() => setShowImagesModal(false)}>
          <h2>Galerie d'images</h2>
          <div className="images-offer">
            {offer.pictures && offer.pictures.length > 0 ? (
              offer.pictures.map((picture: string, index: number) => (
                <Link to={picture} key={index}>
                  <img
                    src={picture}
                    alt={`Image ${index + 1}`}
                    className="modal-img"
                  />
                </Link>
              ))
            ) : (
              <p>Aucune image disponible.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OfferPage;
