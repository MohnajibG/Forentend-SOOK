import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Utilisation du hook personnalisé
import "../assets/styles/profilePage.css";

interface ProfileData {
  username: string;
  email: string;
  address: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  sexe: string;
  dateOfBorn: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useUser(); // Utilisation du hook pour récupérer le token depuis le contexte
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<ProfileData>>(
    {}
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("Token non disponible. Veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/user/${id}/profilePage`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Utiliser le token depuis le contexte
            },
          }
        );

        setProfile(response.data);
      } catch (error) {
        console.log("Erreur lors de la récupération du profil :", error);
        setError("Impossible de charger les informations du profil.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    } else {
      setError("ID utilisateur manquant.");
      setLoading(false);
    }
  }, [id, token]); // Ajouter token en dépendance

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!token) {
        setError("Token non disponible. Veuillez vous connecter.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/user/${id}/profilePage`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data); // Mettre à jour le profil avec les nouvelles données
      setEditMode(false);
      setUpdatedProfile({}); // Réinitialiser les champs modifiés
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError("Impossible de mettre à jour le profil.");
    }
  };

  if (loading) {
    return <div className="spinner">Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profil</h1>
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
        <div>
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
