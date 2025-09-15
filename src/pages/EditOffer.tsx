// src/pages/EditOffer.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ImageUpload from "../components/ImgUpload";
import { useUser } from "../contexts/UserContext";

import background from "../assets/img/backgroundEdit.png";

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
  const [loading, setLoading] = useState(false);

  // Charger les infos de l’offre existante
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/offers/${id}`
        );

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
        setMessage("Impossible de charger l'annonce.");
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
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);

    try {
      await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/offers/update/${id}`,
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

      setMessage("Votre produit a été modifié avec succès !");
      navigate(`/offer/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      setMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la mise à jour de l'offre."
      );
    } finally {
      setLoading(false);
    }
  };

  const isError = message?.toLowerCase().includes("erreur");

  return (
    <main className="relative min-h-screen text-white font-[Krub] flex flex-col justify-center mx-4 md:mx-20 lg:mx-24 py-24 md:mb-40">
      <img
        src={background}
        alt="Image de fond"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <h2 className="text-xl md:text-4xl font-bold text-center mb-6 drop-shadow-black">
        MODIFIER VOTRE PRODUIT
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-4"
      >
        {/* Titre */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">
            Titre de l'annonce :
          </h3>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Description */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Description :</h3>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Prix */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Prix :</h3>
          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={0.01}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Condition */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Condition :</h3>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black outline-none border border-white/20 hover:bg-white/85 transition"
          >
            <option value="">Sélectionner</option>
            <option value="Neuf">Neuf</option>
            <option value="Très bon état">Très bon état</option>
            <option value="Bon état">Bon état</option>
            <option value="Usé">Usé</option>
          </select>
        </label>

        {/* Ville */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Ville :</h3>
          <input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Marque */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Marque :</h3>
          <input
            type="text"
            placeholder="Marque"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Taille */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Taille :</h3>
          <input
            type="text"
            placeholder="Taille"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Couleur */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1 font-bold">Couleur :</h3>
          <input
            type="text"
            placeholder="Couleur"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 px-4 bg-white/90 text-black placeholder-black/60 outline-none border border-white/20 hover:bg-white/85 transition"
          />
        </label>

        {/* Photos */}
        <div className="w-full flex flex-col">
          <h3 className="text-white text-base mb-2 font-bold">Photos :</h3>
          <ImageUpload setImageUrl={setImageUrls} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 w-full bg-[#dfa080bd] hover:bg-[#c87660] text-white font-bold text-lg rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Mettre à jour"}
        </button>

        {message && (
          <div
            className={[
              "mx-auto my-6 text-center px-5 py-3 border transition-colors duration-300 opacity-80",
              isError
                ? "bg-[#f5828b] text-[#721c24] border-[#f5c6cb]"
                : "bg-[#f96666] text-[#571515] border-[#ff0000]/30",
            ].join(" ")}
          >
            {message}
          </div>
        )}
      </form>
    </main>
  );
};

export default EditOffer;
