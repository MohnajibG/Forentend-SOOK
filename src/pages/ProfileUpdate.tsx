import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../contexts/UserContext";
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
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
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
        const { data } = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileData((prev) => ({
          ...prev,
          avatar: data.account?.avatar || "",
          address: data.account?.address || "",
          postalCode: data.account?.postalCode || "",
          country: data.account?.country || "",
          phoneNumber: data.account?.phoneNumber || "",
          sexe: data.account?.sexe || "Autre",
          dateOfBorn: data.account?.dateOfBorn || "",
        }));
      } catch {
        setError("Erreur lors de la récupération du profil.");
      }
      setLoading(false);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLoadingAvatar(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("upload_preset", "SookIMG");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );
        setProfileData((prev) => ({ ...prev, avatar: res.data.secure_url }));
      } catch {
        setError("Erreur lors de l'upload de l'avatar.");
      }
      setLoadingAvatar(false);
    }
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
      const updatedProfile = { ...profileData };
      const res = await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(res.data);
      navigate(`/profilePage/${userId}`);
    } catch {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex justify-center items-center text-white font-[Krub]">
        <img
          src={backgroundUpdateProfil}
          alt="Background Update Profil"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        Chargement...
      </div>
    );
  }

  return (
    <main className="relative mt-20 pb-40 text-white font-[Krub] flex flex-col items-center gap-20">
      <img
        src={backgroundUpdateProfil}
        alt="Background Update Profil"
        className="fixed inset-0 w-full h-screen object-cover -z-10"
      />

      <h2 className="text-2xl font-bold text-center mb-4">
        Mettre à jour le profil
      </h2>
      {error && (
        <p className="text-red-500 font-bold text-center text-sm">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={
              username
                ? username.charAt(0).toUpperCase() +
                  username.slice(1).toLowerCase()
                : ""
            }
            disabled
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          <label htmlFor="sexe">Sexe</label>
          <select
            id="sexe"
            name="sexe"
            value={profileData.sexe}
            onChange={handleInputChange}
            className="w-60 px-3 py-2 text-sm bg-white/90 rounded"
          >
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>

          <label htmlFor="dateOfBorn">Date de naissance</label>
          <input
            id="dateOfBorn"
            name="dateOfBorn"
            type="date"
            value={profileData.dateOfBorn}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          <label htmlFor="address">Adresse</label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          <label htmlFor="postalCode">Code postal</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={profileData.postalCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          <label htmlFor="country">Pays</label>
          <input
            id="country"
            name="country"
            type="text"
            value={profileData.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          <label htmlFor="phoneNumber">Numéro de téléphone</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+33655000000"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/90 text-black rounded"
          />

          {/* Avatar */}
          <div className="flex items-center gap-4 cursor-pointer">
            <label htmlFor="avatar" className="text-sm font-bold">
              +Ajouter Votre Photo de Profil
            </label>
            <input
              id="avatar"
              type="file"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
              disabled={loading}
            />
            {loadingAvatar && (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            )}
            {profileData.avatar && (
              <img
                src={profileData.avatar}
                alt="Aperçu de l'avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-32 bg-[#dfa080bd] hover:bg-[#c87660] text-white font-bold py-2 rounded transition-colors"
        >
          Mettre à jour
        </button>
      </form>
    </main>
  );
};

export default ProfileUpdate;
