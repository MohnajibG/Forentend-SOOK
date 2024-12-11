import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";

import "../assets/styles/profileUpdate.css";
import backgroundUpdateProfil from "../assets/img/hero.jpg";

const ProfileUpdate: React.FC = () => {
  const { username, token, userId } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    address: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    sexe: "Autre" as "Homme" | "Femme" | "Autre",
    dateOfBorn: "",
    avatar: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setProfileData((prev) => ({
          ...prev,
          address: data.address || "",
          postalCode: data.postalCode || "",
          country: data.country || "",
          phoneNumber: data.phoneNumber || "",
          sexe: data.sexe || "Autre",
          dateOfBorn: data.dateOfBorn || "",
        }));
      } catch (err) {
        setError("Erreur lors de la récupération du profil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      avatar: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token || !userId || !id) {
      setError("Données utilisateur manquantes.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) formData.append(key, value as string | Blob);
      });

      await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-profileUpdate">
        <img src={backgroundUpdateProfil} alt="Background Update Profil" />
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-profileUpdate">
      <img src={backgroundUpdateProfil} alt="Background Update Profil" />
      <h2>Mettre à jour le profil</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-picture">
          <label htmlFor="avatar">+ Ajouter une photo</label>
          <input
            id="avatar"
            type="file"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          {profileData.avatar && (
            <img src={URL.createObjectURL(profileData.avatar)} alt="Preview" />
          )}
        </div>

        <div className="profileUpdate-info">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={username || "Nom non disponible"}
            disabled
          />

          <label htmlFor="sexe">Sexe</label>
          <select
            id="sexe"
            name="sexe"
            value={profileData.sexe}
            onChange={handleInputChange}
          >
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>

          <label htmlFor="dateOfBorn">Date de naissance</label>
          <input
            id="dateOfBorn"
            type="date"
            name="dateOfBorn"
            value={profileData.dateOfBorn}
            onChange={handleInputChange}
          />

          <label htmlFor="address">Adresse</label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
          />

          <label htmlFor="postalCode">Code postal</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={profileData.postalCode}
            onChange={handleInputChange}
          />

          <label htmlFor="country">Pays</label>
          <input
            id="country"
            name="country"
            type="text"
            value={profileData.country}
            onChange={handleInputChange}
          />

          <label htmlFor="phoneNumber">Numéro de téléphone</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+33655000000"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="button-profileUpdate">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
