import axios from "axios";
import { useEffect, useState } from "react";

import { Account, ProfilProps } from "../types/types";

import { useUser } from "../contexts/UserContext";

import backgroundUpdateProfil from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

import "../assets/styles/profilePage.css";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { token, userId } = useUser();
  const navigate = useNavigate();

  const [dataProfile, setDataProfile] = useState<ProfilProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<Account["account"]>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // pour gérer le fichier de l'avatar

  useEffect(() => {
    const fetchProfile = async () => {
      const _id = userId;
      try {
        setLoading(true);

        if (!token || !userId) {
          setError("Token ou userId manquant.");
          setLoading(false);
          return;
        }

        const response = await axios.get<ProfilProps>(
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDataProfile(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        setError("Impossible de charger votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    try {
      if (
        !updatedProfile.address ||
        !updatedProfile.phoneNumber ||
        !updatedProfile.country
      ) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      if (!token || !userId) {
        alert("Vous devez être connecté pour mettre à jour votre profil.");
        return;
      }

      const formData = new FormData();
      // Ajout de l'avatar dans les données si un fichier a été sélectionné
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      // Ajout des autres données de profil
      Object.keys(updatedProfile).forEach((key) => {
        formData.append(
          key,
          updatedProfile[key as keyof typeof updatedProfile] as string
        );
      });

      const response = await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataProfile(response.data);
      setEditMode(false);
      setUpdatedProfile({});
      setAvatarFile(null); // Réinitialise le fichier avatar
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="profile-page">
      <img
        className="background-img"
        src={backgroundUpdateProfil}
        alt="Background Update Profil"
      />
      <div className="Load">
        <img src={Loading} alt="" />
      </div>
    </div>
  ) : error ? (
    <p className="error-message">{error}</p>
  ) : (
    <div className="profile-page">
      <img
        className="background-img"
        src={backgroundUpdateProfil}
        alt="Background Update Profil"
      />
      <h1>Votre Profil</h1>
      <div className="profil-content">
        <img
          className="avatar-profil"
          src={dataProfile?.account?.avatar || ""}
          alt="Avatar"
        />

        {editMode ? (
          <div className="profile-informations">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <div className="input-group">
              <input
                name="username"
                value={
                  updatedProfile.username ||
                  dataProfile?.account?.username ||
                  ""
                }
                onChange={handleInputChange}
                placeholder="Nom d'utilisateur"
              />
            </div>
            <div className="input-group">
              <input
                name="address"
                value={
                  updatedProfile.address || dataProfile?.account?.address || ""
                }
                onChange={handleInputChange}
                placeholder="Adresse"
              />
            </div>
            <div className="input-group">
              <input
                name="postalCode"
                value={
                  updatedProfile.postalCode ||
                  dataProfile?.account?.postalCode ||
                  ""
                }
                onChange={handleInputChange}
                placeholder="Code postal"
              />
            </div>
            <div className="input-group">
              <input
                name="country"
                value={
                  updatedProfile.country || dataProfile?.account?.country || ""
                }
                onChange={handleInputChange}
                placeholder="Pays"
              />
            </div>
            <div className="input-group">
              <input
                name="phoneNumber"
                value={
                  updatedProfile.phoneNumber ||
                  dataProfile?.account?.phoneNumber ||
                  ""
                }
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
              />
            </div>
            <div className="input-group">
              <select
                name="sexe"
                value={updatedProfile.sexe || dataProfile?.account?.sexe || ""}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Sélectionnez votre sexe
                </option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="input-group">
              <input
                type="date"
                name="dateOfBorn"
                value={
                  updatedProfile.dateOfBorn ||
                  dataProfile?.account?.dateOfBorn ||
                  ""
                }
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              {avatarFile && <p>Avatar sélectionné: {avatarFile.name}</p>}
            </div>
            <button onClick={handleSave}>Enregistrer</button>
          </div>
        ) : (
          <div className="profile-informations">
            <p>
              Nom d'utilisateur :{" "}
              {dataProfile?.account?.username || "Non renseigné"}
            </p>
            <p>Adresse : {dataProfile?.account?.address || "Non renseigné"}</p>
            <p>
              Code postal :{" "}
              {dataProfile?.account?.postalCode || "Non renseigné"}
            </p>
            <p>Pays : {dataProfile?.account?.country || "Non renseigné"}</p>
            <p>
              Numéro de téléphone :{" "}
              {dataProfile?.account?.phoneNumber || "Non renseigné"}
            </p>
            <p>Sexe : {dataProfile?.account?.sexe || "Non renseigné"}</p>
            <p>
              Date de naissance :{" "}
              {dataProfile?.account?.dateOfBorn || "Non renseigné"}
            </p>
            <button
              onClick={() => {
                setUpdatedProfile({
                  username: dataProfile?.account?.username,
                  address: dataProfile?.account?.address ?? undefined,
                  postalCode: dataProfile?.account?.postalCode ?? undefined,
                  country: dataProfile?.account?.country ?? undefined,
                  phoneNumber: dataProfile?.account?.phoneNumber ?? undefined,
                  sexe: dataProfile?.account?.sexe ?? undefined,
                  dateOfBorn: dataProfile?.account?.dateOfBorn ?? undefined,
                  avatar: dataProfile?.account?.avatar ?? undefined,
                });
                setEditMode(true);
              }}
            >
              Modifier
            </button>
          </div>
        )}
      </div>
      <button className="back-home-btn" onClick={() => navigate("/home")}>
        Retour à l'accueil
      </button>
    </div>
  );
};

export default ProfilePage;
