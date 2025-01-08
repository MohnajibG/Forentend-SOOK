import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Assurez-vous que le contexte utilisateur est bien importé
import background from "../img/background-publish.webp";

import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImgUpload"; // Assurez-vous que le chemin est correct

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useUser(); // Récupérer le token depuis le contexte utilisateur

  // Déclaration des états pour chaque champ
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // URL de l'image téléchargée
  const [message, setMessage] = useState<string | null>(null); // Message d'erreur ou succès
  const [loading, setLoading] = useState<boolean>(false); // Indicateur de chargement

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Validation des champs obligatoires
    if (
      !title ||
      !description ||
      price <= 0 ||
      !city ||
      !brand ||
      !color ||
      !imageUrl
    ) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", "jean femme");
    formData.append("description", "jean pour femme");
    formData.append("price", "17");
    formData.append("city", "lile");
    formData.append("brand", "zara");
    formData.append("color", "bleu");
    formData.append("pictures", imageUrl); // file est l'objet File sélectionné

    try {
      // Envoi de la demande API pour publier l'offre
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/offers/publish",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token Bearer dans l'en-tête
          },
        }
      );
      console.log("Publication réussie", response.data);
      setMessage("Votre produit a été publié avec succès !");
      setTimeout(() => {
        navigate("/offer"); // Redirection vers la page des offres
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la publication", error);
      setMessage(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la publication de l'offre."
      );
    } finally {
      setLoading(false); // Fin du chargement
    }
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
        <h3>Photos</h3> <ImageUpload setImageUrl={setImageUrl} />
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Publier l'offre"}
        </button>
      </form>
    </main>
  );
};

export default Publish;
