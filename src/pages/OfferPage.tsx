// src/pages/OfferPage.tsx
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    return <p className="text-center text-red-500 font-bold mt-20">{error}</p>;
  if (!offer) return <p className="text-center mt-20">Aucune offre trouvée.</p>;

  return (
    <main className="relative min-h-screen font-[Krub] text-white mt-24 pb-40">
      {/* Background plein écran */}
      <img
        src={background}
        alt="Background"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Bandeau utilisateur */}
        <div className="flex items-center justify-between bg-[#fbcfe695] shadow-[0_0_10px_2px_rgb(255,255,255)]  p-4  mb-6">
          <p className="font-bold text-lg text-white drop-shadow-md ">
            {offer.userId.account?.username?.toUpperCase() || "NON SPÉCIFIÉ"}
          </p>
          <img
            src={offer.userId.account?.avatar || ""}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>

        {/* Bloc principal */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Détails de l'offre */}
          <div
            className="bg-white/80  p-6 text-black cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowDetailsModal(true)}
          >
            <h1 className="text-2xl font-bold text-center mb-4 text-[#e97510] drop-shadow-md">
              {offer.title || "Titre non disponible"}
            </h1>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Marque :</span>{" "}
                {offer.brand || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Description :</span>{" "}
                {offer.description || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Prix :</span>{" "}
                {offer.price ? `${offer.price} €` : "Non spécifié"}
              </p>
              <p>
                <span className="font-semibold">Taille :</span>{" "}
                {offer.size || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Couleur :</span>{" "}
                {offer.color || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Condition :</span>{" "}
                {offer.condition || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Ville :</span>{" "}
                {offer.city || "Non spécifiée"}
              </p>
            </div>
          </div>

          {/* Images + AddToCart */}
          <div className="bg-white/80  p-6 flex flex-col gap-4 items-center">
            <div
              className="w-full flex overflow-x-auto gap-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 cursor-pointer"
              onClick={() => setShowImagesModal(true)}
            >
              {offer.pictures && offer.pictures.length > 0 ? (
                offer.pictures.map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    alt={`image-${idx}`}
                    className="flex-shrink-0 w-full md:w-80 h-64 object-cover  snap-start"
                  />
                ))
              ) : (
                <p className="text-gray-600 p-4">Aucune image disponible</p>
              )}
            </div>

            <AddToCartButton
              cart={cart}
              setCart={setCart}
              item={{
                productId: offer._id || "",
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
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-3  bg-[#dfa080bd] hover:bg-[#c87660] text-white font-bold transition-colors"
            onClick={() => navigate(`/mesoffres`)}
          >
            ← Retour aux Offres
          </button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetailsModal && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <h2 className="text-2xl font-bold mb-3 text-black">
            Détails de l'offre
          </h2>
          <div className="space-y-2 text-black/90">
            <p>
              <span className="font-semibold">Marque :</span>{" "}
              {offer.brand || "Non spécifiée"}
            </p>
            <p>
              <span className="font-semibold">Description :</span>{" "}
              {offer.description || "Non spécifiée"}
            </p>
            <p>
              <span className="font-semibold">Prix :</span>{" "}
              {offer.price ? `${offer.price} €` : "Non spécifié"}
            </p>
            <p>
              <span className="font-semibold">Taille :</span>{" "}
              {offer.size || "Non spécifiée"}
            </p>
            <p>
              <span className="font-semibold">Couleur :</span>{" "}
              {offer.color || "Non spécifiée"}
            </p>
            <p>
              <span className="font-semibold">Condition :</span>{" "}
              {offer.condition || "Non spécifiée"}
            </p>
            <p>
              <span className="font-semibold">Ville :</span>{" "}
              {offer.city || "Non spécifiée"}
            </p>
          </div>
        </Modal>
      )}

      {/* Modal Images */}
      {showImagesModal && (
        <Modal onClose={() => setShowImagesModal(false)}>
          <h2 className="text-2xl font-bold mb-3 text-black">
            Galerie d'images
          </h2>
          <div className="w-[80vw] max-w-3xl max-h-[70vh] overflow-auto flex flex-wrap gap-3 justify-center">
            {offer.pictures && offer.pictures.length > 0 ? (
              offer.pictures.map((pic, idx) => (
                <img
                  key={idx}
                  src={pic}
                  alt={`image-${idx}`}
                  className="w-40 h-40 object-cover rounded-md hover:scale-105 transition-transform"
                />
              ))
            ) : (
              <p className="text-black/70">Aucune image disponible</p>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
};

export default OfferPage;
