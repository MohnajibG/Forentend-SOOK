import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { MoreVertical } from "lucide-react"; // icône menu

import { useUser } from "../contexts/UserContext";
import { ProfilProps } from "../types/types";

import background from "../assets/img/offerPage.webp";
import LOGO from "../assets/img/LOGO.png";

const MyOffers: React.FC = () => {
  const { token } = useUser();
  const [myOffers, setMyOffers] = useState<ProfilProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOffers = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyOffers(data.offers || []);
      } catch (err: any) {
        console.error("Erreur lors du chargement des offres :", err);
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Erreur lors du chargement des offres. Veuillez réessayer.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOffers();
  }, [token]);

  const handleDeleteMyOffer = async (offerId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?"))
      return;

    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/offers/delete/${offerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyOffers((prev) =>
        prev.filter((o) => (o._id || (o as any).id) !== offerId)
      );
      toast.success("Offre supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre :", err);
      toast.error("Impossible de supprimer l'offre. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen grid place-items-center text-white font-[Krub]">
        <img
          src={background}
          alt="Background"
          className="fixed inset-0 -z-10 w-full h-screen object-cover"
        />
        <ClipLoader size={50} color="#f10303" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen mt-20 pb-40 px-4 md:px-8 text-white font-[Krub]">
      <img
        src={background}
        alt="Background"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      {error && (
        <div className="text-red-500 text-center font-bold mb-4">{error}</div>
      )}

      <div className="mx-auto w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold">Mes Annonces</h2>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 rounded-md font-semibold
                     bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>

      {myOffers.length === 0 ? (
        <p className="mx-auto w-full max-w-6xl text-center">
          Vous n'avez encore publié aucun article.
        </p>
      ) : (
        <div className="mx-auto w-full max-w-6xl flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
          {myOffers.map((offer) => {
            const id = offer._id || (offer as any).id;
            const firstImage =
              Array.isArray(offer.pictures) && offer.pictures.length > 0
                ? offer.pictures[0]
                : LOGO;

            return (
              <div
                key={id}
                className="relative flex flex-col rounded-2xl bg-[#ffffffae] shadow-[0_4px_8px_rgba(0,0,0,0.1)] 
                           hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-shadow w-full sm:w-[300px]"
              >
                {/* Bouton menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                    className="p-2 rounded-full bg-white/70 hover:bg-white shadow"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Menu dropdown */}
                  {openMenuId === id && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-900 rounded-md shadow-lg overflow-hidden z-10">
                      <button
                        onClick={() => navigate(`/offer/${id}`)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-pink-300"
                      >
                        Voir l’annonce
                      </button>
                      <button
                        onClick={() => navigate(`/offer/update/${id}`)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-pink-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteMyOffer(id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="w-full h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={firstImage}
                    alt={offer.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenu */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-[#333]">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-[#666]">{offer.description}</p>
                  <p className="text-sm font-medium text-[#666]">
                    Prix : {offer.price} €
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyOffers;
