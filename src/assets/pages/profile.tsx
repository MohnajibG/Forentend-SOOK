import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ajouter cette ligne
import "../styles/profile.css";

type ProfileProps = {
  username: string | null;
  token: string | null;
};

const Profile: React.FC<ProfileProps> = ({ username, token }) => {
  const [avatar, setAvatar] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const navigate = useNavigate(); // Déclarer le hook useNavigate

  // Utilisation de l'username reçu via les props
  useEffect(() => {
    if (username) {
      console.log("Nom d'utilisateur chargé:", username);
    }
  }, [username]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profil mis à jour:", {
      avatar,
      address,
      phoneNumber,
      postalCode,
      country,
    });

    // Après la soumission du formulaire, rediriger l'utilisateur
    navigate("/"); // Utiliser navigate pour rediriger après la mise à jour
  };

  return (
    token && (
      <div className="main-profile">
        <h2>Mon Profil</h2>
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
            <div className="adress">
              <textarea
                id="adresse"
                name="adresse"
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <label htmlFor="codepostal">Code postal</label>
            <div>
              <input
                id="codepostal"
                name="codepostal"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <label htmlFor="pays">Pays</label>
            <div>
              <input
                id="pays"
                name="pays"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <label htmlFor="phoneNumber">Numéro de téléphone :</label>
            <input
              className="input"
              id="telephone"
              type="tel"
              placeholder="par ex&nbsp;: +33655000000"
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
