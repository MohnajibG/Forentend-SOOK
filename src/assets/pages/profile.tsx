import { useState } from "react";
import "../styles/profile.css";

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [address, setAddress] = useState<string>("123 rue Exemple");
  const [phoneNumber, setPhoneNumber] = useState<string>("0123456789");

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
    console.log("Profil mis à jour:", { avatar, address, phoneNumber });
  };

  return (
    <div className="main-profile">
      <h2>Mon Profil</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-image">
          <label>
            Image de profil :
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>
          <div>
            <img src={avatar} alt="Avatar" className="profile-avatar" />
          </div>
        </div>

        <div className="profile-info">
          <label htmlFor="address">Adresse :</label>
          <input
            className="input"
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez votre adresse"
          />

          <label htmlFor="phoneNumber">Numéro de téléphone :</label>
          <input
            className="input"
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Entrez votre numéro de téléphone"
          />
        </div>

        <button className="button-profile">Mettre à jour</button>
      </form>
    </div>
  );
};

export default Profile;
