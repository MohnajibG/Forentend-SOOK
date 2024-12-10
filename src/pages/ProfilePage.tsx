import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../assets/styles/profilePage.css";

import backgroundUpdateProfil from "../assets/img/hero.jpg";
import logo from "../assets/img/LOGO1.png";

import { Account, UserProfile } from "../types/types";

const ProfilePage: React.FC = () => {
  const { token, userId } = useUser();

  const [dataProfile, setDataProfile] = useState<Account | UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<Account | UserProfile>
  >({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!token) {
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
      const response = await axios.put<Account | UserProfile | UserContextType>(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profilePage/${userId}`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDataProfile(response.data);
      setEditMode(false);
      setUpdatedProfile({});
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <img src={backgroundUpdateProfil} alt="Background Update Profil" />
        <div className="spinner">
          <img src={logo} alt="Logo de Sook" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <img src={backgroundUpdateProfil} alt="Background Update Profil" />
      <h1>Votre Profil</h1>
      {editMode ? (
        <div>
          <input
            name="username"
            value={updatedProfile.username || dataProfile?.username || ""}
            onChange={handleInputChange}
            placeholder="Nom d'utilisateur"
          />
          <input
            name="email"
            value={updatedProfile.email || dataProfile?.email || ""}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            name="address"
            value={updatedProfile.address || dataProfile?.address || ""}
            onChange={handleInputChange}
            placeholder="Adresse"
          />
          <input
            name="postalCode"
            value={updatedProfile.postalCode || dataProfile?.postalCode || ""}
            onChange={handleInputChange}
            placeholder="Code postal"
          />
          <input
            name="country"
            value={updatedProfile.country || dataProfile?.country || ""}
            onChange={handleInputChange}
            placeholder="Pays"
          />
          <input
            name="phoneNumber"
            value={updatedProfile.phoneNumber || dataProfile?.phoneNumber || ""}
            onChange={handleInputChange}
            placeholder="Numéro de téléphone"
          />
          <select
            name="sexe"
            value={updatedProfile.sexe || dataProfile?.sexe || ""}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Sélectionnez votre sexe
            </option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </select>
          <input
            name="dateOfBorn"
            value={updatedProfile.dateOfBorn || dataProfile?.dateOfBorn || ""}
            onChange={handleInputChange}
            placeholder="Date de naissance"
          />
          <button onClick={handleSave}>Enregistrer</button>
        </div>
      ) : (
        <div className="profile-informations">
          <p>Nom d'utilisateur : {dataProfile?.username || "Non renseigné"}</p>
          <p>Email : {dataProfile?.email || "Non renseigné"}</p>
          <p>Adresse : {dataProfile?.address || "Non renseigné"}</p>
          <p>Code postal : {dataProfile?.postalCode || "Non renseigné"}</p>
          <p>Pays : {dataProfile?.country || "Non renseigné"}</p>
          <p>
            Numéro de téléphone : {dataProfile?.phoneNumber || "Non renseigné"}
          </p>
          <p>Sexe : {dataProfile?.sexe || "Non renseigné"}</p>
          <p>
            Date de naissance : {dataProfile?.dateOfBorn || "Non renseigné"}
          </p>
          <button onClick={() => setEditMode(true)}>Modifier</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
