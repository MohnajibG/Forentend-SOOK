// src/pages/OfferPage.tsx
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProfilProps } from "../types/types";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoArrowBack, IoExpandOutline } from "react-icons/io5";

import AddToCartButton from "../components/AddToCartButton";
import Modal from "../components/Modal";
import { API_URL } from "../settings/api";

import background from "../assets/img/offerPage.webp";
import LOGO from "../assets/img/LOGO.png";

const OfferPage: React.FC = () => {
  const [offer, setOffer] = useState<ProfilProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
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
        const { data } = await axios.get(`${API_URL}/offers/${id}`);
        setOffer(data.offer);
        setActiveImage(0);
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
    return (
      <p className="page-shell text-center text-red-500 font-bold">{error}</p>
    );
  if (!offer)
    return <p className="page-shell text-center">Aucune offre trouvée.</p>;

  const pictures = offer.pictures && offer.pictures.length > 0 ? offer.pictures : [];
  const specs = [
    { label: "Marque", value: offer.brand },
    { label: "Taille", value: offer.size },
    { label: "Couleur", value: offer.color },
    { label: "Ville", value: offer.city },
  ].filter((s) => s.value);

  return (
    <main className="relative min-h-screen page-shell">
      {/* Background plein écran */}
      <img
        src={background}
        alt="Background"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/offers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white mb-4 transition-colors"
        >
          <IoArrowBack /> Retour aux offres
        </Link>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Galerie photo */}
          <div className="glass-rose p-4">
            <div
              className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in group"
              onClick={() => setShowImagesModal(true)}
            >
              {pictures.length > 0 ? (
                <img
                  src={pictures[activeImage]}
                  alt={`${offer.title || "Offre"} — photo ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/60">
                  Aucune image disponible
                </div>
              )}
              {offer.condition && (
                <span className="glass-badge absolute top-3 left-3">
                  {offer.condition}
                </span>
              )}
              {pictures.length > 0 && (
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <IoExpandOutline /> Agrandir
                </span>
              )}
            </div>

            {pictures.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {pictures.map((pic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === activeImage
                        ? "border-white"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={pic}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos & achat */}
          <div className="glass-rose p-6 flex flex-col gap-5">
            {/* Vendeur */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/25">
              <img
                src={offer.userId.account?.avatar || LOGO}
                alt={offer.userId.account?.username || "Vendeur"}
                className="w-11 h-11 rounded-full object-cover border-2 border-white/60"
              />
              <div>
                <p className="font-bold leading-tight">
                  {offer.userId.account?.username || "Vendeur inconnu"}
                </p>
                {offer.city && (
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <HiOutlineLocationMarker /> {offer.city}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {offer.title || "Titre non disponible"}
              </h1>
              <p className="text-3xl font-bold text-[#dfa080]">
                {offer.price ? `${offer.price} €` : "Prix non spécifié"}
              </p>
            </div>

            {specs.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt className="text-white/60 uppercase tracking-wide text-xs mb-0.5">
                      {s.label}
                    </dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {offer.description && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-white/60 mb-1.5">
                  Description
                </h2>
                <p className="text-sm leading-relaxed text-white/90">
                  {offer.description}
                </p>
              </div>
            )}

            <div className="mt-auto pt-2">
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
              <p className="text-xs text-white/60 text-center mt-3">
                Paiement sécurisé via Stripe · Vendu entre particuliers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Images */}
      {showImagesModal && (
        <Modal onClose={() => setShowImagesModal(false)} variant="images">
          <h2 className="text-2xl font-bold mb-4">
            {offer.title || "Galerie d'images"}
          </h2>
          <div className="w-full flex flex-wrap items-center justify-center gap-3">
            {pictures.length > 0 ? (
              pictures.map((pic, idx) => (
                <img
                  key={idx}
                  src={pic}
                  alt={`image-${idx}`}
                  className="w-64 h-64 object-cover rounded-lg hover:scale-105 transition-transform"
                />
              ))
            ) : (
              <p className="text-white/70">Aucune image disponible</p>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
};

export default OfferPage;
