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

  const [pictures, setPictures] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormValid = (): boolean => {
    const { title, description, price, city, brand, color } = formData;

    if (!title || !description || !price || !city || !brand || !color) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid()) return;

    try {
      setLoading(true);
      setMessage(null);

      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      pictures.forEach((picture) => {
        formPayload.append("pictures", picture);
      });

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
      console.log(response.data);

      setMessage("Votre produit a été publié avec succès !");
      setTimeout(() => {
        navigate("/offer");
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
      setMessage("Erreur lors de la publication de l'offre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-publish">
      <img
        className="publish-background-img"
        src={background}
        alt="Image de fond"
      />
      <form className="publish" onSubmit={handleSubmit}>
        <div className="input-picture">
          <label htmlFor="pictures">+ Ajouter vos photos</label>
          <input
            id="pictures"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              setPictures((prevPictures) => [...prevPictures, ...files]);
            }}
          />

          {pictures.length > 0 && (
            <div className="image-preview">
              {pictures.map((picture, index) => (
                <div key={index} className="image-container">
                  <img
                    className="pictures"
                    src={URL.createObjectURL(picture)}
                    alt={`Aperçu de l'image ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => {
                      setPictures((prevPictures) =>
                        prevPictures.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="publish-content">
          <h2>Publier votre article</h2>

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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Envoi en cours..." : "Publier"}
          </button>
        </div>
      </form>

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
