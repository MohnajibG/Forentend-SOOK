import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

import background from "../img/background-publish.webp";
import { FormDataType } from "../../types/types";

import "../styles/publish.css";
import "../styles/button.css";

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

  const handleSubmit = async () => {
    setMessage(null);

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    pictures.forEach((picture) => {
      formPayload.append("pictures", picture);
    });

    console.log("FormData avant envoi :");
    formPayload.forEach((value, key) => console.log(`${key}: ${value}`));

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/offers/publish",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setMessage("Votre produit a été publié avec succès !");
      setTimeout(() => {
        navigate("/offer");
      }, 5000);
    } catch (error: unknown) {
      console.log("Erreur lors de la publication de l'offre :", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Erreur lors de la publication de l'offre.");
      }
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
            { label: "Titre", name: "title", placeholder: "ex: Chemise Zara" },
            {
              label: "Description",
              name: "description",
              placeholder: "ex: porté quelques fois, taille bien",
            },
            { label: "Marque", name: "brand", placeholder: "ex: Zara" },
            { label: "Taille", name: "size", placeholder: "ex: L / 40 / 12" },
            {
              label: "Couleur",
              name: "color",
              placeholder: "ex: Vert, Rouge, Bleu",
            },
            {
              label: "Condition",
              name: "condition",
              placeholder: "ex: Neuf avec étiquette",
            },
            { label: "Ville", name: "city", placeholder: "ex: Paris" },
            {
              label: "Prix",
              name: "price",
              placeholder: "ex: 25.00",
              type: "number",
            },
          ].map(({ label, name, placeholder, type = "text" }) => (
            <div className="input-publish" key={name}>
              <h3>{label} :</h3>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(formData as any)[name]}
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
