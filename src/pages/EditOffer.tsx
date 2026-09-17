// src/pages/EditOffer.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ImageUpload from "../components/ImgUpload";
import { useUser } from "../contexts/UserContext";
import { API_URL } from "../settings/api";

import background from "../assets/img/backgroundEdit.png";

const inputClass =
  "w-full h-12 px-4 bg-white/90 text-black placeholder-black/50 rounded-lg " +
  "outline-none border border-white/20 hover:bg-white transition focus:ring-2 focus:ring-white/70";

const labelClass = "text-white text-sm font-bold mb-1.5 block";

const EditOffer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // correspond à /offer/update/:id
  const { token, userId } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Charger les infos de l'offre existante
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`${API_URL}/offers/${id}`);

        // ⚡ adapter selon la structure de ton backend
        const data = res.data.offer || res.data;

        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || 0);
        setCity(data.city || "");
        setBrand(data.brand || "");
        setSize(data.size || "");
        setColor(data.color || "");
        setCondition(data.condition || "");
        setImageUrls(data.pictures || []);
      } catch (error) {
        console.error("Erreur lors du chargement de l'offre", error);
        setIsSuccess(false);
        setMessage("Impossible de charger cette annonce.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchOffer();
  }, [id]);

  const isFormValid = (): boolean => {
    if (
      !title ||
      !description ||
      price <= 0 ||
      !city ||
      !brand ||
      !color ||
      imageUrls.length === 0 ||
      !userId
    ) {
      setIsSuccess(false);
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    if (!isFormValid()) return;

    setLoading(true);

    try {
      await axios.put(
        `${API_URL}/offers/update/${id}`,
        {
          title,
          description,
          price,
          city,
          brand,
          size,
          color,
          condition,
          pictures: imageUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSuccess(true);
      setMessage("Votre annonce a été mise à jour avec succès ! Redirection...");
      setTimeout(() => navigate(`/offer/${id}`), 900);
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      setIsSuccess(false);
      setMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la mise à jour de l'offre. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen page-shell flex flex-col justify-center mx-4 md:mx-10 lg:mx-24">
      <img
        src={background}
        alt="Image de fond"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <div className="glass-rose w-full max-w-3xl mx-auto flex flex-col gap-6 px-6 py-10 md:px-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Modifier l'annonce
          </h2>
          <p className="text-white/75 text-sm mt-2 max-w-md mx-auto">
            Mettez à jour les informations de votre article — les
            changements seront visibles immédiatement.
          </p>
        </div>

        {fetching ? (
          <p className="text-center text-white/80 py-6">Chargement de l'annonce...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Titre */}
            <label className="w-full">
              <span className={labelClass}>Titre de l'annonce *</span>
              <input
                type="text"
                placeholder="Ex : Blouson en cuir vintage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </label>

            {/* Description */}
            <label className="w-full">
              <span className={labelClass}>Description *</span>
              <textarea
                placeholder="Décrivez la matière, la coupe, les éventuels défauts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} h-auto py-3 resize-none`}
              />
            </label>

            {/* Ligne : Prix / Marque */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label>
                <span className={labelClass}>Prix (€) *</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                  step={0.01}
                  className={inputClass}
                />
              </label>
              <label>
                <span className={labelClass}>Marque *</span>
                <input
                  type="text"
                  placeholder="Ex : Zara, Nike..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            {/* Ligne : Condition / Taille */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label>
                <span className={labelClass}>État</span>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sélectionner</option>
                  <option value="Neuf">Neuf</option>
                  <option value="Très bon état">Très bon état</option>
                  <option value="Bon état">Bon état</option>
                  <option value="Usé">Usé</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Taille</span>
                <input
                  type="text"
                  placeholder="Ex : M, 40, unique..."
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            {/* Ligne : Couleur / Ville */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label>
                <span className={labelClass}>Couleur *</span>
                <input
                  type="text"
                  placeholder="Ex : Bleu marine"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label>
                <span className={labelClass}>Ville *</span>
                <input
                  type="text"
                  placeholder="Ex : Lyon"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            {/* Photos */}
            <div className="w-full flex flex-col">
              <span className={labelClass}>Photos *</span>
              <ImageUpload setImageUrl={setImageUrls} initialImages={imageUrls} />
            </div>

            {message && (
              <div
                className={`text-center px-5 py-3 rounded-lg border text-sm font-semibold ${
                  isSuccess
                    ? "bg-green-500/20 text-green-100 border-green-400/40"
                    : "bg-red-500/20 text-red-100 border-red-400/40"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-12 w-full text-lg"
            >
              {loading ? "Mise à jour en cours..." : "Enregistrer les modifications"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default EditOffer;
