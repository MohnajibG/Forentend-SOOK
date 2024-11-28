// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "../assets/styles/profileUpdate.css";

// type profileUpdateProps = {
//   username: string | null;
//   token: string | null;
// };

// const profileUpdate: React.FC<profileUpdateProps> = ({ username, token }) => {
//   const { id } = useParams();
//   const [avatar, setAvatar] = useState<string>(
//     "https://via.placeholder.com/150"
//   );
//   const [file, setFile] = useState<File | null>(null);
//   const [address, setAddress] = useState<string>("");
//   const [postalCode, setPostalCode] = useState<string>("");
//   const [country, setCountry] = useState<string>("");
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [sexe, setSexe] = useState<"Homme" | "Femme" | "Autre">("Homme"); // Nouveau champ sexe
//   const [dateOfBorn, setDateOfBorn] = useState<string>(""); // Nouveau champ dateOfBorn
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (username) {
//       console.log("Nom d'utilisateur chargé:", username);
//     }
//   }, [username]);

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       setFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatar(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true); // Active le spinner
//     setError(null); // Réinitialise les erreurs
//     setSuccess(null); // Réinitialise le succès

//     if (!token) {
//       setLoading(false);
//       setError("Vous devez être connecté pour mettre à jour votre profil.");
//       return;
//     }

//     if (!id) {
//       setLoading(false);
//       setError("L'ID utilisateur est manquant.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       if (file) {
//         formData.append("avatar", file);
//       }

//       // Envoi du fichier d'avatar
//       const avatarResponse = await axios.put(
//         `http://localhost:3000/user/profileUpdate/${id}/avatar`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Mise à jour des autres informations de profil
//       await axios.put(
//         `http://localhost:3000/user/profileUpdate/${id}`,
//         {
//           avatar: avatarResponse.data.avatarUrl,
//           address,
//           phoneNumber,
//           postalCode,
//           country,
//           sexe, // Ajout de sexe
//           dateOfBorn, // Ajout de date de naissance
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccess("Profil mis à jour avec succès !");
//       setTimeout(() => navigate("/"), 2000); // Redirection après succès
//     } catch (error) {
//       console.error(
//         "Erreur lors de l'upload de l'avatar ou de la mise à jour du profil:",
//         error
//       );
//       setError(
//         "Une erreur s'est produite lors de la mise à jour de votre profil."
//       );
//     } finally {
//       setLoading(false); // Désactive le spinner
//     }
//   };

//   return (
//     token && (
//       <div className="main-profileUpdate">
//         <h2>Mon Profil</h2>
//         {error && <p className="error-message">{error}</p>}
//         {success && <p className="success-message">{success}</p>}

//         {loading ? (
//           <div className="spinner-container">
//             <div className="spinner"></div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="profileUpdate-image">
//               <label>
//                 Image de profil :
//                 <input
//                   className="input-img"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                 />
//               </label>
//               <div>
//                 <img src={avatar} alt="Avatar" className="profileUpdate-avatar" />
//               </div>
//             </div>

//             <div className="profileUpdate-info">
//               <label htmlFor="username">Nom d'utilisateur</label>
//               <input
//                 id="username"
//                 type="text"
//                 value={username || "Nom d'utilisateur non disponible"}
//                 disabled
//               />
//               <label htmlFor="sexe">Sexe</label>
//               <select
//                 id="sexe"
//                 value={sexe}
//                 onChange={(e) =>
//                   setSexe(e.target.value as "Homme" | "Femme" | "Autre")
//                 }
//               >
//                 <option value="Homme">Homme</option>
//                 <option value="Femme">Femme</option>
//                 <option value="Autre">Autre</option>
//               </select>

//               <label htmlFor="dateOfBorn">Date de naissance</label>
//               <input
//                 type="date"
//                 id="dateOfBorn"
//                 value={dateOfBorn}
//                 onChange={(e) => setDateOfBorn(e.target.value)}
//                 required
//               />

//               <label htmlFor="adresse">Adresse</label>
//               <textarea
//                 id="adresse"
//                 name="adresse"
//                 required
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />

//               <label htmlFor="codepostal">Code postal</label>
//               <input
//                 id="codepostal"
//                 name="codepostal"
//                 type="text"
//                 value={postalCode}
//                 onChange={(e) => setPostalCode(e.target.value)}
//                 required
//               />

//               <label htmlFor="pays">Pays</label>
//               <input
//                 id="pays"
//                 name="pays"
//                 type="text"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 required
//               />

//               <label htmlFor="phoneNumber">Numéro de téléphone :</label>
//               <input
//                 className="input"
//                 id="telephone"
//                 type="tel"
//                 placeholder="par ex : +33655000000"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//             </div>

//             <button type="submit" className="button-profileUpdate">
//               Mettre à jour
//             </button>
//           </form>
//         )}
//       </div>
//     )
//   );
// };

// export default profileUpdate;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/profileUpdate.css";

type profileUpdateProps = {
  username: string | null;
  token: string | null;
};

const ProfileUpdate: React.FC<profileUpdateProps> = ({ username, token }) => {
  const { id } = useParams();
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [sexe, setSexe] = useState<"Homme" | "Femme" | "Autre" | "-">("-");
  const [dateOfBorn, setDateOfBorn] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !id) return;

    // Fonction pour récupérer les informations du profil
    const fetchprofileUpdateData = async () => {
      setLoading(true); // Active le loading spinner

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

        // Remplir les champs avec les données récupérées
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
        setLoading(false); // Désactive le loading spinner
      }
    };

    fetchprofileUpdateData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Active le spinner
    setError(null); // Réinitialise les erreurs
    setSuccess(null); // Réinitialise le succès

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
          sexe, // Ajout de sexe
          dateOfBorn, // Ajout de date de naissance
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => navigate("/"), 2000); // Redirection après succès
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError(
        "Une erreur s'est produite lors de la mise à jour de votre profil."
      );
    } finally {
      setLoading(false); // Désactive le spinner
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
