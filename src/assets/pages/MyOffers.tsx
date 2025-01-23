import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../img/Loading.gif";
import background from "../img/offerPage.webp";

const MyOffers: React.FC = () => {
  const { token, userId } = useUser();
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOffer = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(userId);

        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/myOffers/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("data", response.data);

        setMyOffers(response.data.offers || []);
      } catch (error) {
        console.error("Erreur lors de la récupération de vos offres", error);
        setError("Erreur lors du chargement de l'offre. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyOffer();
  }, [userId, token]);

  const handleDeleteMyOffers = async (offerId: string) => {
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
    } catch (error) {
      console.error("Erreur lors de la suppression de votre offre", error);
      setError("Impossible de supprimer l'offre. Veuillez réessayer.");
    }
  };

  return loading ? (
    <main className="myoffers-main">
      <img src={background} alt="Background" className="background-img" />
      <img src={Loading} alt="Chargement..." />
    </main>
  ) : (
    <main className="myoffers-main">
      <img
        src={background}
        alt="Image de fond des offres"
        className="background-img"
      />

      {error && <div className="error-message">{error}</div>}

      {myOffers.length === 0 ? (
        <p>Vous n'avez aucun article publié</p>
      ) : (
        myOffers.map((offer) => (
          <div key={offer._id}>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <button onClick={() => handleDeleteMyOffers(offer._id)}>
              Supprimer
            </button>
          </div>
        ))
      )}
    </main>
  );
};

export default MyOffers;
