import React, { useState } from "react";
import axios from "axios";
import { ImageUploadProps } from "../types/types";

const ImageUpload: React.FC<ImageUploadProps> = ({ setImageUrl }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<(File | string)[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);

    // Validation MIME
    const validFiles = fileArray.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
    if (validFiles.length !== fileArray.length) {
      setError("Certains fichiers n'ont pas un format valide.");
      return;
    }

    setError(null);
    setLoading(true);

    // pré-aperçu local immédiat
    setPictures((prev) => [...prev, ...validFiles]);

    // NOTE: l’API Cloudinary /image/upload accepte 1 fichier par requête.
    // On envoie donc chaque fichier séparément.
    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "SookIMG");
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );
        uploadedUrls.push(data.secure_url);
      }

      // on pousse les URLs vers le parent
      setImageUrl((prev: any[]) => [...prev, ...uploadedUrls]);

      // on remplace les File par leur URL dans la preview locale
      setPictures((prev) => {
        const next = [...prev];
        let i = next.length - validFiles.length;
        for (const url of uploadedUrls) {
          next[i] = url; // remplace le File qui vient d'être envoyé
          i++;
        }
        return next;
      });
    } catch (err) {
      console.error("Erreur lors de l'upload des images:", err);
      setError("Erreur lors de l'upload des images.");
    } finally {
      setLoading(false);
      // reset input pour pouvoir réuploader les mêmes fichiers si besoin
      e.currentTarget.value = "";
    }
  };

  const handleRemove = (index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
    setImageUrl((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-3 justify-center items-center">
      <label
        htmlFor="pictures"
        className="
          inline-flex items-center justify-center
          px-4 py-2 rounded font-bold text-white cursor-pointer
          bg-[#dfa080eb] hover:bg-[#c87660] transition-colors
          w-max
        "
      >
        + Ajouter vos photos
      </label>

      <input
        id="pictures"
        name="pictures"
        type="file"
        className="hidden"
        onChange={handleImageUpload}
        multiple
        accept="image/jpeg,image/png,image/webp"
        disabled={loading}
      />

      {/* Prévisualisation */}
      {pictures.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {pictures.map((picture, index) => {
            const src =
              picture instanceof File
                ? URL.createObjectURL(picture)
                : (picture as string);

            return (
              <div
                key={index}
                className="relative inline-block rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
              >
                <img
                  src={src}
                  alt={`Aperçu de l'image ${index + 1}`}
                  className="w-[100px] h-[100px] object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="
                    absolute -top-2 -right-2 w-6 h-6 rounded-full
                    bg-red-600 text-black text-xs font-bold
                    grid place-items-center
                    hover:bg-red-700 transition-colors
                  "
                  aria-label="Supprimer l'image"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {loading && <p className="text-white/90">Chargement...</p>}
      {error && (
        <p className="text-sm font-semibold text-red-500 drop-shadow">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
