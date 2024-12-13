import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

import "../assets/styles/profileUpdate.css";
import backgroundUpdateProfil from "../assets/img/hero.jpg";

const ProfileUpdate: React.FC = () => {
  const { username, token, userId } = useUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    address: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    sexe: "Autre",
    dateOfBorn: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || !token) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

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
          address: data.account?.address || "",
          postalCode: data.account?.postalCode || "",
          country: data.account?.country || "",
          phoneNumber: data.account?.phoneNumber || "",
          sexe: data.account?.sexe || "Autre",
          dateOfBorn: data.account?.dateOfBorn || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token || !userId) {
      setError("Données utilisateur manquantes.");
      setLoading(false);
      return;
    }

    try {
      const updatedProfile = {
        address: profileData.address,
        postalCode: profileData.postalCode,
        country: profileData.country,
        phoneNumber: profileData.phoneNumber,
        sexe: profileData.sexe,
        dateOfBorn: profileData.dateOfBorn,
      };

      console.log("Données envoyées :", updatedProfile);

      // Envoi de la requête pour mettre à jour le profil (sans FormData)
      const response = await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(response.data);
      navigate(`/profilePage/${userId}`);
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(error);
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
        <div className="profileUpdate-info">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={
              username
                ? username.charAt(0).toUpperCase() +
                  username.slice(1).toLowerCase()
                : "Nom non disponible"
            }
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
