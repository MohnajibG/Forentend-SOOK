import React, { useState } from "react";
import axios from "axios";

import "../styles/publish.css";

interface ImageUploadProps {
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>; // Pour passer l'URL de l'image au parent
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImageUrl }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<File[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLoading(true);
      setPictures((prevPictures) => [...prevPictures, files[0]]); // Ajoute l'image au tableau des images

      const formData = new FormData();
      formData.append("file", files[0]); // On envoie la première image
      formData.append("upload_preset", "SookIMG"); // Remplacez par votre upload preset Cloudinary

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );
        console.log("Image uploadée avec succès:", response.data);
        setImageUrl(response.data.secure_url); // Récupérez l'URL de l'image et passez-la au parent
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        setError("Erreur lors de l'upload de l'image.");
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
