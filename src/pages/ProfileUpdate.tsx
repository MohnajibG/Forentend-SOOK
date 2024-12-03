import { useUser } from "../contexts/UserContext"; // Assurez-vous d'importer useUser
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/profileUpdate.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ProfileUpdate: React.FC = () => {
  const { username, token, userId } = useUser(); // Utilisation du contexte ici
  const { id } = useParams();
  const navigate = useNavigate(); // Appeler le hook useNavigate

  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [sexe, setSexe] = useState<"Homme" | "Femme" | "Autre" | "-">("-");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [dateOfBorn, setDateOfBorn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Effectuer les actions de mise à jour du profil, etc.
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:3000/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = response.data;

        // Remplir les champs avec les données récupérées
        setAddress(profileData.address || "");
        setPostalCode(profileData.postalCode || "");
        setCountry(profileData.country || "");
        setPhoneNumber(profileData.phoneNumber || "");
        setSexe(profileData.sexe || "Homme");
        setDateOfBorn(profileData.dateOfBorn || "");
      } catch (error) {
        console.error(
          // "Erreur lors de la récupération des données du profil",
          error
        );
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, userId]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      setLoading(false);
      return;
    }

    if (!userId || !id) {
      setLoading(false);
      return;
    }

    try {
      // Créer un objet FormData pour inclure l'avatar
      const formData = new FormData();
      formData.append("address", address);
      formData.append("phoneNumber", phoneNumber);
      formData.append("postalCode", postalCode);
      formData.append("country", country);
      formData.append("sexe", sexe);
      formData.append("dateOfBorn", dateOfBorn);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      // Envoi de la requête PUT
      await axios.put(`http://localhost:3000/profile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => navigate("/"), 3000); // Rediriger après succès
    } catch (error) {
      console.log("Erreur lors de la mise à jour du profil:", error);
      setLoading(false);
    }
  };

  return (
    <div className="main-profileUpdate">
      <h2>Mon Profil</h2>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-picture">
            <label htmlFor="picture">+ Ajouter votre photo</label>
            <input
              id="picture"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                setAvatar(e.target.files ? e.target.files[0] : null);
              }}
            />
            {avatar && (
              <img src={URL.createObjectURL(avatar)} alt="Image preview" />
            )}
          </div>
          <div className="profileUpdate-info">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username || "Nom d'utilisateur non disponible"}
              disabled
            />

            <label htmlFor="sexe">Sexe</label>
            <select
              id="sexe"
              value={sexe}
              onChange={(e) =>
                setSexe(e.target.value as "Homme" | "Femme" | "Autre")
              }
            >
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>

            <label htmlFor="dateOfBorn">Date de naissance</label>
            <input
              type="date"
              id="dateOfBorn"
              value={dateOfBorn}
              onChange={(e) => setDateOfBorn(e.target.value)}
              required
            />

            <label htmlFor="adresse">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="codepostal">Code postal</label>
            <input
              id="codepostal"
              name="codepostal"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />

            <label htmlFor="pays">Pays</label>
            <input
              id="pays"
              name="pays"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            <label htmlFor="phoneNumber">Numéro de téléphone :</label>
            <input
              className="input"
              id="telephone"
              type="tel"
              placeholder="par ex : +33655000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <button type="submit" className="button-profileUpdate">
            Mettre à jour
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileUpdate;
