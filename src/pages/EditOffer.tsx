import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
        const { data } = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre :", err);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/mesoffres");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Modifier l'annonce
        </h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Titre :</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full px-4 py-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#dfa080bd]
                transition
              "
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Description :</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="
                w-full px-4 py-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#dfa080bd]
                transition resize-none
              "
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Prix (€) :</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="
                w-full px-4 py-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-[#dfa080bd]
                transition
              "
              min="0"
              step="0.01"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 mt-4 rounded-md text-white font-bold
              bg-[#dfa080bd] hover:bg-[#c87660]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditOffer;
