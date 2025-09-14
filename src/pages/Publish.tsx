import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageUpload from "../components/ImgUpload";
import { useUser } from "../contexts/UserContext";

import background from "../assets/img/background-publish.webp";

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { token, userId } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUrls, setImageUrls] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("city", city);
    formData.append("brand", brand);
    formData.append("color", color);
    formData.append("condition", condition);
    formData.append("size", size);
    if (userId) formData.append("userId", userId);
    imageUrls.forEach((file) => formData.append("pictures", file));

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/offers/publish",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const offerId = response.data._id;
      setMessage("Votre produit a été publié avec succès !");
      navigate(`/offer/${offerId}`);
    } catch (error) {
      console.error("Erreur lors de la publication", error);
      setMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la publication de l'offre."
      );
    } finally {
      setLoading(false);
    }
  };

  const isError = message?.toLowerCase().includes("erreur");

  return (
    <main
      className="
        relative min-h-screen text-white font-[Krub] font-bold
        flex flex-col justify-center mx-4 md:mx-20 lg:mx-24 py-12
      "
    >
      {/* Background plein écran fixé */}
      <img
        src={background}
        alt="Image de fond"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <h2 className="text-xl md:text-4xl font-bold text-center mb-6 drop-shadow-[0_0_20px_rgba(252,124,124,0.8)]">
        Publier votre produit
      </h2>

      {message && (
        <div
          className={[
            "mx-auto my-10 text-center px-5 py-3 text-base rounded border",
            "transition-colors duration-300",
            isError
              ? "bg-[#f5828b] text-[#721c24] border-[#f5c6cb]"
              : "bg-[#f96666] text-[#571515] border-[#ff0000]",
          ].join(" ")}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-4"
      >
        {/* Titre */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Titre de l'annonce :</h3>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Description */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Description :</h3>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Prix */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Prix :</h3>
          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Condition */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Condition :</h3>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="
      w-full h-12 rounded px-4
      bg-white/90 text-black
      outline-none border border-white/20
      hover:bg-white/85 transition
    "
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
          <h3 className="text-white text-base mb-1">Ville :</h3>
          <input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Marque */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Marque :</h3>
          <input
            type="text"
            placeholder="Marque"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Taille */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Taille :</h3>
          <input
            type="text"
            placeholder="Taille"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Couleur */}
        <label className="w-full">
          <h3 className="text-white text-base mb-1">Couleur :</h3>
          <input
            type="text"
            placeholder="Couleur"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="
              w-full h-12 rounded px-4
              bg-white/90 text-black placeholder-black/60
              outline-none border border-white/20
              hover:bg-white/85 transition
            "
          />
        </label>

        {/* Photos */}
        <div className="w-full flex flex-col ">
          <h3 className="text-white text-base mb-2">Photos :</h3>
          <ImageUpload setImageUrl={setImageUrls} />
          {/* 
            Si tu veux styler le bouton interne d'ImageUpload comme avant :
            ajoute dans ce composant les classes :
            'bg-[#dfa080bd] text-white px-6 py-2 font-bold cursor-pointer transition-colors hover:bg-[#c87660] rounded'
          */}
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-4 h-12 w-full
            bg-[#dfa080bd] hover:bg-[#c87660]
            text-white font-bold text-lg
            rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Chargement..." : "Publier"}
        </button>
      </form>
    </main>
  );
};

export default Publish;
