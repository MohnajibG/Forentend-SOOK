import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";

import { useUser } from "../contexts/UserContext";

import { Offer } from "../types/types"; // 👈 On suppose que tu as un type Offer

import "../assets/styles/style.css";

import background from "../assets/img/offerPage.webp";

const MyOffers: React.FC = () => {
  const { token, userId } = useUser();
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOffers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyOffers(response.data.offers || []);
      } catch (err: any) {
        setError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Erreur lors du chargement des offres. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyOffers();
  }, [userId, token]);

  const handleDeleteMyOffer = async (offerId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      return;
    }
    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/offers/user/${offerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyOffers((prevOffers) =>
        prevOffers.filter((offer) => offer._id !== offerId)
      );
      toast.success("Offre supprimée avec succès !");
    } catch (err: any) {
      console.error("Erreur lors de la suppression de l'offre", err);
      toast.error("Impossible de supprimer l'offre. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <main className="myoffers-main">
        <img src={background} alt="Background" className="background-img" />
        <div className="Load">
          <ClipLoader size={50} color="#f10303" />
        </div>
      </main>
    );
  }

  return (
    <main className="myoffers-main">
      <img src={background} alt="Background" className="background-img" />

      {error && <div className="error-message">{error}</div>}

      <div className="myoffers-header">
        <h2>Mes Annonces</h2>
        <button className="return-button" onClick={() => navigate("/home")}>
          ← Retour à l'accueil
        </button>
      </div>

      {myOffers.length === 0 ? (
        <p>Vous n'avez encore publié aucun article.</p>
      ) : (
        <div className="offers-grid">
          {myOffers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p>Prix : {offer.price} €</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteMyOffer(offer._id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyOffers;
