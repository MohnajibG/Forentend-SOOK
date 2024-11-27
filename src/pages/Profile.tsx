import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/profile.css";

type ProfileProps = {
  username: string | null;
  token: string | null;
  userId?: string | null;
};

const Profile: React.FC<ProfileProps> = ({ username, token }) => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [avatar, setAvatar] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      console.log("Nom d'utilisateur chargé:", username);
    }
  }, [username]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    if (!id) {
      // Vérifie que l'ID est disponible
      setError("L'ID utilisateur est manquant.");
      return;
    }

    try {
      const formData = new FormData();
      if (file) {
        formData.append("avatar", file); // Utilise le fichier sélectionné
      }

      // Envoi du fichier d'avatar à la route back-end correspondante
      const avatarResponse = await axios.put(
        `http://localhost:3000/user/${id}/profile/avatar`, // Mise à jour de l'avatar via PUT
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mise à jour des autres informations de profil
      await axios.put(
        `http://localhost:3000/user/${id}/profile`,
        {
          avatar: avatarResponse.data.avatarUrl,
          address,
          phoneNumber,
          postalCode,
          country,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profil mis à jour avec succès !");
      navigate("/");

      // Réinitialiser le formulaire après succès
      setAvatar("https://via.placeholder.com/150");
      setFile(null);
      setAddress("");
      setPostalCode("");
      setCountry("");
      setPhoneNumber("");
    } catch (error) {
      console.error(
        "Erreur lors de l'upload de l'avatar ou de la mise à jour du profil:",
        error
      );
      setError(
        "Une erreur s'est produite lors de la mise à jour de votre profil."
      );
    }
  };

  return (
    token && (
      <div className="main-profile">
        <h2>Mon Profil</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="profile-image">
            <label>
              Image de profil :
              <input
                className="input-img"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
            <div>
              <img src={avatar} alt="Avatar" className="profile-avatar" />
            </div>
          </div>

          <div className="profile-info">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username || "Nom d'utilisateur non disponible"}
              disabled
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

          <button type="submit" className="button-profile">
            Mettre à jour
          </button>
        </form>
      </div>
    )
  );
};

export default Profile;
