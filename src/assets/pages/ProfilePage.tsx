import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/profilePage.css";

import backgroundUpdateProfil from "../img/hero.jpg";
import Loading from "../img/Loading.gif";

import { FaPen } from "react-icons/fa";
import { Account } from "../../types/types";

const ProfilePage: React.FC = () => {
  const { token, userId } = useUser();

  const [dataProfile, setDataProfile] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<Account["account"]>
  >({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!token || !userId) {
          setError("Token ou userId manquant.");
          setLoading(false);
          return;
        }

        const response = await axios.get<Account>(
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
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
  }, [token, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
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
      setDataProfile(response.data);
      setEditMode(false);
      setUpdatedProfile({});
    } catch (error) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <img src={backgroundUpdateProfil} alt="Background Update Profil" />
        <div className="Load">
          <img src={Loading} alt="" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-page">
      <img src={backgroundUpdateProfil} alt="Background Update Profil" />
      <h1>Votre Profil</h1>
      {editMode ? (
        <div>
          <div className="input-group">
            <input
              name="username"
              value={
                updatedProfile.username || dataProfile?.account?.username || ""
              }
              onChange={handleInputChange}
              placeholder="Nom d'utilisateur"
            />
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            <button onClick={() => setEditMode(true)}>
              <FaPen />
            </button>
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
            Code postal : {dataProfile?.account?.postalCode || "Non renseigné"}
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
              setUpdatedProfile(dataProfile?.account || {});
              setEditMode(true);
            }}
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
