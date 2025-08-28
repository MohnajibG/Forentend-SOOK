import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProfilProps } from "../types/types";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

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
        const { data } = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );
        setOffer(data.offer);
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

  const handleAddToCartSuccess = () =>
    toast.success("Produit ajouté au panier !");

  if (loading)
    return (
      <div className="grid place-items-center min-h-screen">
        <ClipLoader size={50} color="#f10303" />
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 font-bold">{error}</p>;
  if (!offer) return <p className="text-center">Aucune offre trouvée.</p>;

  return (
    <div className="relative min-h-screen text-white font-[Krub] mt-20 pb-40">
      {/* Background plein écran fixé */}
      <img
        src={background}
        alt="Background"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Bandeau utilisateur */}
        <div className="w-full bg-[#fbcfe680] flex items-center justify-between md:justify-around px-4 py-3 rounded-xl shadow-[0_0_10px_2px_rgb(255,255,255)]">
          <p className="font-extrabold text-lg drop-shadow-[0_0_10px_rgb(255,255,255)]">
            {offer.userId.account?.username?.toUpperCase() || "NON SPÉCIFIÉ"}
          </p>
          <img
            src={offer.userId.account?.avatar || ""}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover shadow-[0_0_10px_2px_rgb(255,255,255)]"
          />
        </div>

        {/* Bloc principal */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Détails */}
          <div
            className="bg-[rgba(251,248,238,0.598)] rounded-xl p-4 text-black/90 cursor-pointer"
            onClick={() => setShowDetailsModal(true)}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-center text-lg font-semibold text-[#e97510] drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] mb-4">
                {offer.title || "Titre non disponible"}
              </h1>
              <p className="text-[14px] text-[#666]">
                Marque : {offer.brand || "Non spécifiée"}
              </p>
              <p className="text-[14px] text-[#666]">
                Description : {offer.description || "Non spécifiée"}
              </p>
              <p className="text-[14px] text-[#666]">
                Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}
              </p>
              <p className="text-[14px] text-[#666]">
                Taille : {offer.size || "Non spécifiée"}
              </p>
              <p className="text-[14px] text-[#666]">
                Couleur : {offer.color || "Non spécifiée"}
              </p>
            </div>
          </div>

          {/* Images + bouton */}
          <div className="bg-[rgba(251,248,238,0.598)] rounded-xl p-4 flex flex-col gap-4 items-center">
            {/* Carousel images – une seule image par vue */}
            <div
              className="
    w-full
    overflow-x-auto overflow-y-hidden
    flex flex-nowrap           /* ← ici on force l’axe horizontal */
    snap-x snap-mandatory
    scrollbar-thin
    scrollbar-thumb-gray-400 scrollbar-track-gray-200
  "
              onClick={() => setShowImagesModal(true)}
            >
              {offer.pictures && offer.pictures.length > 0 ? (
                offer.pictures.map((picture, i) => (
                  <Link
                    to={picture}
                    key={i}
                    className="flex-shrink-0 w-full snap-start"
                  >
                    <img
                      src={picture}
                      alt={`Image ${i + 1}`}
                      className="w-full h-[400px] md:h-[500px] object-cover rounded-md"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-600 p-4">Aucune image disponible.</p>
              )}
            </div>

            <AddToCartButton
              cart={cart}
              setCart={setCart}
              item={{
                productId: offer._id || "", // 🔥 correction ici
                name: offer.title || "",
                price: offer.price || 0,
              }}
              token={token || ""}
              userId={offer.userId._id}
              onSuccess={handleAddToCartSuccess}
            />
          </div>
        </div>

        {/* Retour */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
            onClick={() => navigate("/offers")}
          >
            ← Retour aux Offres
          </button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <h2 className="text-xl font-semibold mb-3 text-black">
            Détails de l'offre
          </h2>
          <div className="space-y-1 text-black/80">
            <p>Marque : {offer.brand || "Non spécifiée"}</p>
            <p>Description : {offer.description || "Non spécifiée"}</p>
            <p>Prix : {offer.price ? `${offer.price} €` : "Non spécifié"}</p>
            <p>Taille : {offer.size || "Non spécifiée"}</p>
            <p>Couleur : {offer.color || "Non spécifiée"}</p>
            <p>Condition : {offer.condition || "Non spécifiée"}</p>
            <p>Ville : {offer.city || "Non spécifiée"}</p>
          </div>
        </Modal>
      )}

      {/* Modal Images */}
      {showImagesModal && (
        <Modal onClose={() => setShowImagesModal(false)}>
          <h2 className="text-xl font-semibold mb-3 text-black">
            Galerie d'images
          </h2>
          <div className="w-[80vw] max-w-3xl max-h-[70vh] overflow-auto flex gap-2 justify-center flex-wrap">
            {offer.pictures && offer.pictures.length > 0 ? (
              offer.pictures.map((picture: string, i: number) => (
                <Link to={picture} key={i}>
                  <img
                    src={picture}
                    alt={`Image ${i + 1}`}
                    className="w-40 h-40 object-cover rounded-md hover:scale-105 transition-transform"
                  />
                </Link>
              ))
            ) : (
              <p className="text-black/70">Aucune image disponible.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OfferPage;
