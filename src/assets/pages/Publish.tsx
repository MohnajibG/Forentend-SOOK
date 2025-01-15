import { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import background from "../img/background-publish.webp";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImgUpload";

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { token, userId } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [imageUrls, setImageUrls] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
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
    if (userId) {
      formData.append("userId", userId);
    }
    imageUrls.forEach((url) => formData.append("pictures", url));
    console.log("encours");

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/offers/publish",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Publication réussie", response.data);
      setMessage("Votre produit a été publié avec succès !");
      navigate("/offer");
    } catch (error) {
      console.error("Erreur lors de la publication", error);
      setMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la publication de l'offre."
      );
    }
    setLoading(false);
  };

  return (
    <main className="main-publish">
      <img
        className="publish-background-img"
        src={background}
        alt="Image de fond"
      />
      <h2>Publier votre produit</h2>
      {message && (
        <div
          className={`message ${
            message.includes("erreur") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="publish-container">
        <h3>Titre de l'annonce : </h3>
        <input
          aria-label="Titre"
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h3>Description:</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h3>Prix:</h3>
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <h3>Condition</h3>
        <input
          type="text"
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <h3>Ville</h3>
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <h3>Marque</h3>
        <input
          type="text"
          placeholder="Marque"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <h3>Taille</h3>
        <input
          type="text"
          placeholder="Taille"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <h3>Couleur</h3>
        <input
          type="text"
          placeholder="Couleur"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <h3>Photos</h3>
        <ImageUpload setImageUrl={setImageUrls} />
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Publier"}
        </button>
      </form>
    </main>
  );
};

export default Publish;
