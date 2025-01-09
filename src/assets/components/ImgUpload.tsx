import React, { useState } from "react";
import axios from "axios";

import "../styles/publish.css";

import { ImageUploadProps } from "../../types/types";

const ImageUpload: React.FC<ImageUploadProps> = ({ setImageUrl }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<File[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLoading(true);

      setPictures((prevPictures) => [...prevPictures, ...Array.from(files)]);

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("file", file); // Ajoute chaque fichier
      });
      formData.append("upload_preset", "SookIMG");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );

        // Si la réponse est un tableau :
        const imageUrls = Array.isArray(response.data)
          ? response.data.map((item: any) => item.secure_url)
          : [response.data.secure_url]; // Si la réponse est un objet unique

        setImageUrl(imageUrls); // Met à jour l'URL des images
      } catch (error) {
        console.error("Erreur lors de l'upload des images:", error);
        setError("Erreur lors de l'upload des images.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="input-picture">
      <label htmlFor="pictures">+ Ajouter vos photos</label>
      <input
        id="pictures"
        type="file"
        style={{ display: "none" }}
        onChange={handleImageUpload}
        multiple
        disabled={loading} // Désactive le champ pendant le chargement
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
      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload;
