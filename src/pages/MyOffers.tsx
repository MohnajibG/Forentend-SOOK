import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { MoreVertical, Tag, Wallet, PlusCircle } from "lucide-react"; // icônes

import { useUser } from "../contexts/UserContext";
import { ProfilProps } from "../types/types";
import usePageTitle from "../hooks/usePageTitle";
import { API_URL } from "../settings/api";

import background from "../assets/img/offerPage.webp";
import LOGO from "../assets/img/LOGO.png";

const MyOffers: React.FC = () => {
  usePageTitle("Mes annonces");
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
          `${API_URL}/offers/user`,
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
        `${API_URL}/offers/delete/${offerId}`,
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
      <main className="relative min-h-screen grid place-items-center">
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
    <main className="relative min-h-screen page-shell">
      <img
        src={background}
        alt="Background"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      {error && (
        <div className="text-red-500 text-center font-bold mb-4">{error}</div>
      )}

      <div className="mx-auto w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Mes annonces</h1>
          <p className="page-subtitle">
            Gérez, modifiez ou retirez vos articles en vente.
          </p>
        </div>
        <button onClick={() => navigate("/home")} className="btn-secondary">
          ← Retour à l'accueil
        </button>
      </div>

      {myOffers.length > 0 && (
        <div className="mx-auto w-full max-w-6xl grid grid-cols-2 gap-4 mb-8">
          <div className="glass-rose flex items-center gap-3 px-5 py-4">
            <Tag className="text-sook-dore" size={22} />
            <div>
              <p className="text-xl font-bold leading-none">{myOffers.length}</p>
              <p className="text-xs text-white/70 mt-1">
                {myOffers.length > 1 ? "annonces publiées" : "annonce publiée"}
              </p>
            </div>
          </div>
          <div className="glass-rose flex items-center gap-3 px-5 py-4">
            <Wallet className="text-sook-dore" size={22} />
            <div>
              <p className="text-xl font-bold leading-none">
                {myOffers
                  .reduce((sum, o) => sum + (o.price || 0), 0)
                  .toFixed(2)}{" "}
                €
              </p>
              <p className="text-xs text-white/70 mt-1">valeur totale en vente</p>
            </div>
          </div>
        </div>
      )}

      {myOffers.length === 0 ? (
        <div className="glass-rose mx-auto w-full max-w-md text-center px-8 py-12 flex flex-col items-center gap-4">
          <PlusCircle className="text-sook-dore" size={40} />
          <div>
            <h3 className="text-lg font-bold mb-1">Rien à vendre pour l'instant</h3>
            <p className="text-sm text-white/75">
              Publiez votre premier article et il apparaîtra ici, prêt à être
              vu par toute la communauté SOOK.
            </p>
          </div>
          <button onClick={() => navigate("/publish")} className="btn-primary">
            Publier une annonce
          </button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-6xl flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
          {myOffers.map((offer) => {
            const id = offer._id || (offer as any).id;
            const pictures =
              Array.isArray(offer.pictures) && offer.pictures.length > 0
                ? offer.pictures
                : [LOGO];

            return (
              <div
                key={id}
                className="glass-card relative flex flex-col w-full sm:w-[300px]"
              >
                {/* Bouton menu */}
                <div className="absolute top-3 right-3 z-20">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                    className="p-2 rounded-full bg-white/70 hover:bg-white shadow"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Menu dropdown */}
                  {openMenuId === id && (
                    <div
                      className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg overflow-hidden z-10"
                      style={{ background: "var(--color-sook-marron)" }}
                    >
                      <button
                        onClick={() => navigate(`/offer/${id}`)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10"
                      >
                        Voir l'annonce
                      </button>
                      <button
                        onClick={() => navigate(`/offer/update/${id}`)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteMyOffer(id)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#ff8f8f] hover:bg-white/10"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>

                {/* Photo(s) : carrousel scrollable, images centrées */}
                <div className="relative aspect-square">
                  {offer.condition && (
                    <span className="glass-badge absolute top-3 left-3 z-10">
                      {offer.condition}
                    </span>
                  )}
                  <div
                    className="
                      w-full h-full flex overflow-x-auto snap-x snap-mandatory
                      scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent
                    "
                  >
                    {pictures.map((pic, idx) => (
                      <img
                        key={idx}
                        src={pic}
                        alt={`${offer.title || ""} — photo ${idx + 1}`}
                        className="w-full h-full flex-shrink-0 object-cover snap-center"
                      />
                    ))}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 flex flex-col gap-2">
                  {offer.brand && (
                    <p className="text-xs font-bold uppercase tracking-wide text-sook-dore">
                      {offer.brand}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold truncate">{offer.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {offer.description}
                  </p>
                  <p className="text-base font-bold">{offer.price} €</p>
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
