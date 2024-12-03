import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Assure-toi que tu utilises le context pour récupérer le token

import background from "../assets/img/background-publish.webp";
import "../assets/styles/publish.css";

const Publish: React.FC = () => {
  const navigate = useNavigate(); // Hook pour rediriger
  const { token } = useUser(); // Récupérer le token du contexte d'utilisateur

  // Déclaration des états du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [pictures, setPictures] = useState<File[]>([]); // Tableau pour plusieurs images
  const [message, setMessage] = useState<string | null>(null); // Message de succès ou d'erreur

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.log("Token manquant");
      return; // Si pas de token, on ne fait pas l'envoi
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("condition", condition);
      formData.append("city", city);
      formData.append("brand", brand);
      formData.append("size", size);
      formData.append("color", color);

      // Ajouter les images si elles sont présentes
      pictures.forEach((picture) => {
        formData.append("pictures", picture);
      });

      const response = await axios.post(
        "http://localhost:3000/user/offer/publish",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajoute le token dans l'header pour l'authentification
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Offre publiée avec succès:", response.data);
      setMessage("Votre produit a été publié avec succès !");

      // Rediriger après 3 secondes
      setTimeout(() => {
        navigate("/home"); // Redirige vers la page d'accueil
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre:", error);
      setMessage("Une erreur est survenue lors de la publication de l'offre.");
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="main-publish">
      <img src={background} alt="image backgroud" />
      <form className="publish" onSubmit={handleSubmit}>
        <h2>Publier votre article</h2>
        <div className="publish">
          <div className="input-picture">
            <label htmlFor="pictures">+ Ajouter vos photos</label>
            <input
              id="pictures"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setPictures(files); // Mettre à jour le tableau d'images
              }}
            />
            {pictures.length > 0 && (
              <div className="image-preview">
                {pictures.map((picture, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(picture)}
                    alt={`Image preview ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Inputs pour chaque champ du formulaire */}
          <div className="input-publish">
            <h3>Titre:</h3>
            <input
              type="text"
              placeholder="ex: Chemise Sézane verte"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Description:</h3>
            <input
              type="text"
              placeholder="ex: porté quelquefois, taille correctement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Marque:</h3>
            <input
              type="text"
              placeholder="ex: Zara"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Taille:</h3>
            <input
              type="text"
              placeholder="ex: L / 40 / 12"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Couleur:</h3>
            <input
              type="text"
              placeholder="ex: Vert, Rose, Bleu"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Condition:</h3>
            <input
              type="text"
              placeholder="ex: Neuf avec étiquette"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Ville:</h3>
            <input
              type="text"
              placeholder="ex: Paris"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="input-publish">
            <h3>Prix:</h3>
            <input
              type="number"
              placeholder="ex: 0.00 €"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <button type="submit">Envoyer</button>
        </div>
      </form>

      {/* Afficher un message de succès ou d'erreur */}
      {message && <div className="message">{message}</div>}
    </main>
  );
};

export default Publish;
