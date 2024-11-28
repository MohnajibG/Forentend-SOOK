import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/profileUpdate.css";
import { useUser } from "../contexts/UserContext"; // Import du contexte

const ProfileUpdate: React.FC = () => {
  const { id } = useParams();
  const { username, token } = useUser(); // Consommation du contexte pour récupérer username et token
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [sexe, setSexe] = useState<"Homme" | "Femme" | "Autre">("Homme");
  const [dateOfBorn, setDateOfBorn] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Récupération des données de profil existantes lors du montage du composant
  useEffect(() => {
    if (!token || !id) return;

    const fetchProfileUpdateData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:3000/user/profileUpdate/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileUpdateData = response.data;
        setAddress(profileUpdateData.address || "");
        setPostalCode(profileUpdateData.postalCode || "");
        setCountry(profileUpdateData.country || "");
        setPhoneNumber(profileUpdateData.phoneNumber || "");
        setSexe(profileUpdateData.sexe || "Homme");
        setDateOfBorn(profileUpdateData.dateOfBorn || "");
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du profil",
          error
        );
        setError("Impossible de charger les informations du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileUpdateData();
  }, [id, token]);

  // Soumission du formulaire pour la mise à jour du profil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setLoading(false);
      setError("Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    if (!id) {
      setLoading(false);
      setError("L'ID utilisateur est manquant.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/user/profileUpdate/${id}`,
        {
          address,
          phoneNumber,
          postalCode,
          country,
          sexe,
          dateOfBorn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError(
        "Une erreur s'est produite lors de la mise à jour de votre profil."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    token && (
      <div className="main-profileUpdate">
        <h2>Mon Profil</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
    )
  );
};

export default ProfileUpdate;
