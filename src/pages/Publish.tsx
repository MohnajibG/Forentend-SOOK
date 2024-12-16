import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

import background from "../assets/img/background-publish.webp";

import { FormDataType } from "../types/types";

import "../assets/styles/publish.css";
import "../assets/styles/button.css";

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useUser();

  // État global pour les données du formulaire
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    price: "",
    condition: "",
    city: "",
    brand: "",
    size: "",
    color: "",
  });

  // État pour les images et les messages
  const [pictures, setPictures] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validation des champs avant soumission
  const isFormValid = (): boolean => {
    const { title, description, price, condition, city, brand, size, color } =
      formData;

    if (
      !title ||
      !description ||
      !price ||
      !condition ||
      !city ||
      !brand ||
      !size ||
      !color
    ) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (pictures.length === 0) {
      setMessage("Veuillez ajouter au moins une photo.");
      return false;
    }

    return true;
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Vérification de la validité des données
    if (!isFormValid()) return;

    try {
      const formPayload = new FormData();

      // Ajouter les données du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // Ajouter les fichiers images
      pictures.forEach((picture) => {
        formPayload.append("pictures", picture);
      });

      // Requête POST pour publier l'offre
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/offers/publish",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("1", token);
      console.log("2", token);

      // Afficher un message de succès
      setMessage("Votre produit a été publié avec succès !");
      console.log("Réponse de l'API :", response.data);

      // Rediriger après 5 secondes
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
    }
  };

  return (
    <main className="main-publish">
      <img src={background} alt="Image de fond" />
      <form className="publish" onSubmit={handleSubmit}>
        <div className="publish-content">
          <h2>Publier votre article</h2>

          {/* Section pour l'upload des photos */}
          <div className="input-picture">
            <label htmlFor="pictures">+ Ajouter vos photos</label>
            <input
              id="pictures"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setPictures((prevPictures) => [...prevPictures, ...files]); // Ajout des nouvelles images
              }}
            />

            {pictures.length > 0 && (
              <div className="image-preview">
                {pictures.map((picture, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(picture)} // Génération de l'aperçu
                    alt={`Aperçu de l'image ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPictures([])}
                  className="clear-button"
                >
                  Supprimer toutes les images
                </button>
              </div>
            )}
          </div>

          {/* Champs du formulaire */}
          {[
            { name: "title", label: "Titre", placeholder: "ex: Chemise Zara" },
            {
              name: "description",
              label: "Description",
              placeholder: "ex: porté quelques fois, taille bien",
            },
            { name: "brand", label: "Marque", placeholder: "ex: Zara" },
            { name: "size", label: "Taille", placeholder: "ex: L / 40 / 12" },
            {
              name: "color",
              label: "Couleur",
              placeholder: "ex: Vert, Rouge, Bleu",
            },
            {
              name: "condition",
              label: "Condition",
              placeholder: "ex: Neuf avec étiquette",
            },
            { name: "city", label: "Ville", placeholder: "ex: Paris" },
            { name: "price", label: "Prix", placeholder: "ex: 25.00" },
          ].map(({ name, label, placeholder }) => (
            <div className="input-publish" key={name}>
              <h3>{label} :</h3>
              <input
                type={name === "price" ? "number" : "text"}
                name={name}
                placeholder={placeholder}
                value={formData[name as keyof FormDataType]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          {/* Bouton de soumission */}
          <button type="submit" className="btn-primary">
            Publier
          </button>
        </div>
      </form>

      {/* Message de feedback */}
      {message && (
        <div
          className={`message ${
            message.includes("erreur") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}
    </main>
  );
};

export default Publish;
