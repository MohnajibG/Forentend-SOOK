import axios from "axios";
import { useEffect, useState } from "react";

import { useUser } from "../contexts/UserContext";

import "../assets/styles/profilePage.css";

import { ProfileDataProps } from "../types/types";

import backgroundUpdateProfil from "../assets/img/hero.jpg";

const ProfilePage: React.FC = () => {
  const { token, userId } = useUser();

  const [profile, setProfile] = useState<ProfileDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<ProfileDataProps>
  >({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
        console.log("data===>:", response.data);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profilePage/${userId}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
      setEditMode(false);
      setUpdatedProfile({});
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  return loading ? (
    <div className="profile-page">
      <img src={backgroundUpdateProfil} alt="background UpdateProfil" />

      <div className="spinner">Chargement...</div>
    </div>
  ) : (
    <div className="profile-page">
      <img src={backgroundUpdateProfil} alt="background UpdateProfil" />
      <h1>Votre Profil</h1>
      {editMode ? (
        <div>
          <input
            name="username"
            value={updatedProfile.username || profile?.username || ""}
            onChange={handleInputChange}
            placeholder="Nom d'utilisateur"
          />
          <input
            name="email"
            value={updatedProfile.email || profile?.email || ""}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            name="address"
            value={updatedProfile.address || profile?.address || ""}
            onChange={handleInputChange}
            placeholder="Adresse"
          />
          <input
            name="postalCode"
            value={updatedProfile.postalCode || profile?.postalCode || ""}
            onChange={handleInputChange}
            placeholder="Code postal"
          />
          <input
            name="country"
            value={updatedProfile.country || profile?.country || ""}
            onChange={handleInputChange}
            placeholder="Pays"
          />
          <input
            name="phoneNumber"
            value={updatedProfile.phoneNumber || profile?.phoneNumber || ""}
            onChange={handleInputChange}
            placeholder="Numéro de téléphone"
          />
          <input
            name="sexe"
            value={updatedProfile.sexe || profile?.sexe || ""}
            onChange={handleInputChange}
            placeholder="Sexe"
          />
          <input
            name="dateOfBorn"
            value={updatedProfile.dateOfBorn || profile?.dateOfBorn || ""}
            onChange={handleInputChange}
            placeholder="Date de naissance"
          />
          <button onClick={handleSave}>Enregistrer</button>
        </div>
      ) : (
        <div className="profile-informations">
          <p>Nom d'utilisateur : {profile?.username}</p>
          <p>Email : {profile?.email}</p>
          <p>Adresse : {profile?.address}</p>
          <p>Code postal : {profile?.postalCode}</p>
          <p>Pays : {profile?.country}</p>
          <p>Numéro de téléphone : {profile?.phoneNumber}</p>
          <p>Sexe : {profile?.sexe}</p>
          <p>Date de naissance : {profile?.dateOfBorn}</p>
          <button onClick={() => setEditMode(true)}>Modifier</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
