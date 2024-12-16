import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

import background from "../assets/img/background-publish.webp";

import "../assets/styles/publish.css";
import "../assets/styles/button.css";

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useUser();

  // État global pour les données du formulaire
  const [formData, setFormData] = useState({
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
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, (formData as never)[key]);
      });

      // Ajouter les fichiers images
      pictures.forEach((picture) => {
        formPayload.append("pictures", picture);
      });

      // Requête POST pour publier l'offre
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/user/offer/publish",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Afficher un message de succès
      setMessage("Votre produit a été publié avec succès !");
      console.log("Réponse de l'API :", response.data);

      // Rediriger après 3 secondes
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur lors de la publication de l'offre :", error);
      const errorMsg =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la publication.";
      setMessage(errorMsg);
    }
  };

  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

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
                setPictures(files);
              }}
            />
            {pictures.length > 0 && (
              <div className="image-preview">
                {pictures.map((picture, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(picture)}
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
                value={(formData as never)[name]}
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
