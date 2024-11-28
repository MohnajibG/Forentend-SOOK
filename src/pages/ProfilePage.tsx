import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import de js-cookie
import "../styles/ProfilePage.css";

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

        const token = Cookies.get("token"); // Récupérer le token depuis les cookies
        if (!token) {
          setError("Token non disponible. Veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/user/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Utiliser le token des cookies
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
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
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Token non disponible. Veuillez vous connecter.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/user/profile/${id}`,
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
          {/* Ajoutez d'autres champs pour les données modifiables */}
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
