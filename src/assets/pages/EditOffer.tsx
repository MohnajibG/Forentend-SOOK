import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const EditOffer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        const offer = response.data;
        setTitle(offer.title);
        setDescription(offer.description);
        setPrice(offer.price);
      } catch (error) {
        console.error("Erreur lors du chargement de l'offre :", error);
      }
    };

    fetchOffer();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/offers/update/${id}`,
        { title, description, price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/my-offers");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
    setLoading(false);
  };

  return (
    <main>
      <h1>Modifier l'offre</h1>
      <form onSubmit={handleUpdate}>
        <label>Titre :</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description :</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Prix :</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </main>
  );
};

export default EditOffer;
