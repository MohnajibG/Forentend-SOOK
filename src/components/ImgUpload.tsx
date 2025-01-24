import React, { useState } from "react";
import axios from "axios";
import "../styles/publish.css";
import { ImageUploadProps } from "../types/types";

const ImageUpload: React.FC<ImageUploadProps> = ({ setImageUrl }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<(File | string)[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Validation des fichiers
      const validFiles = fileArray.filter((file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type)
      );
      if (validFiles.length !== fileArray.length) {
        setError("Certains fichiers n'ont pas un format valide.");
        return;
      }

      setError(null); // Réinitialise l'erreur
      setLoading(true);

      // Ajout local des fichiers
      setPictures((prevPictures) => [...prevPictures, ...validFiles]);

      const formData = new FormData();
      validFiles.forEach((file) => formData.append("file", file));
      formData.append("upload_preset", "SookIMG");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );

        const uploadedUrls = Array.isArray(response.data)
          ? response.data.map((item: any) => item.secure_url)
          : [response.data.secure_url];
        console.log(uploadedUrls);

        setImageUrl((prevUrls) => [...prevUrls, ...uploadedUrls]);
        setPictures((prevPictures) =>
          prevPictures.map((picture) =>
            validFiles.includes(picture as File)
              ? uploadedUrls.shift() || picture
              : picture
          )
        );
      } catch (error) {
        console.error("Erreur lors de l'upload des images:", error);
        setError("Erreur lors de l'upload des images.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="input-picture">
      <label htmlFor="pictures">+ Ajouter vos photos</label>
      <input
        id="pictures"
        name="pictures"
        type="file"
        style={{ display: "none" }}
        onChange={handleImageUpload}
        multiple
        accept="image/jpeg,image/png,image/webp"
        disabled={loading}
      />
      {pictures.length > 0 && (
        <div className="image-preview">
          {pictures.map((picture, index) => (
            <div key={index} className="image-container">
              <img
                className="pictures"
                src={
                  picture instanceof File
                    ? URL.createObjectURL(picture)
                    : picture
                }
                alt={`Aperçu de l'image ${index + 1}`}
              />
              <button
                type="button"
                className="remove-image-button"
                onClick={() => {
                  setPictures((prevPictures) =>
                    prevPictures.filter((_, i) => i !== index)
                  );
                  setImageUrl((prevUrls) =>
                    prevUrls.filter((_, i) => i !== index)
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
