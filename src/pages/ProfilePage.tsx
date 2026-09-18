import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineMailOpen,
  HiOutlineCake,
  HiOutlineUser,
} from "react-icons/hi";

import { Account, ProfilProps } from "../types/types";
import { useUser } from "../contexts/UserContext";
import usePageTitle from "../hooks/usePageTitle";
import { API_URL } from "../settings/api";

import backgroundUpdateProfil from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

// Un <input type="date"> n'accepte que le format YYYY-MM-DD : on tronque
// une éventuelle date ISO complète venue du serveur (ex: 1995-06-15T00:00:00.000Z).
const toDateInputValue = (value?: string | null) => (value ? value.slice(0, 10) : "");

const inputClass =
  "h-11 px-3 bg-white/90 text-black placeholder-black/50 rounded-lg outline-none " +
  "border border-white/20 focus:ring-2 focus:ring-white/70 transition";

const ProfilePage: React.FC = () => {
  usePageTitle("Mon profil");
  const { token, userId } = useUser();
  const navigate = useNavigate();

  const [dataProfile, setDataProfile] = useState<ProfilProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<Account["account"]>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!token || !userId) {
          setError("Token ou userId manquant.");
          setLoading(false);
          return;
        }
        const res = await axios.get<ProfilProps>(
          `${API_URL}/user/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDataProfile(res.data);
      } catch (e) {
        setError("Impossible de charger votre profil.");
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setAvatarFile(f);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(f);

      const formData = new FormData();
      formData.append("file", f);
      formData.append("upload_preset", "SookIMG");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/mngcloudi/image/upload",
          formData
        );

        setUpdatedProfile((prev) => ({
          ...prev,
          avatar: res.data.secure_url,
        }));
      } catch (error) {
        console.error("Erreur upload Cloudinary :", error);
        toast.error("Erreur lors de l'upload de l'image.");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (
        !updatedProfile.address ||
        !updatedProfile.phoneNumber ||
        !updatedProfile.country ||
        !updatedProfile.sexe ||
        !updatedProfile.dateOfBorn
      ) {
        toast.error(
          "Veuillez remplir tous les champs obligatoires, y compris votre date de naissance."
        );
        return;
      }
      if (!token || !userId) {
        toast.error("Vous devez être connecté pour mettre à jour votre profil.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      if (avatarFile) formData.append("avatar", avatarFile);
      // On n'envoie que les champs réellement renseignés : un champ
      // undefined/vide converti en chaîne ("undefined") ferait planter
      // la validation Mongoose côté serveur (ex: date de naissance).
      Object.entries(updatedProfile).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as string);
        }
      });

      const res = await axios.put(
        `${API_URL}/user/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataProfile(res.data);
      setEditMode(false);
      setUpdatedProfile({});
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profil mis à jour avec succès !");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={backgroundUpdateProfil}
          alt=""
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <img
          src={Loading}
          alt="Chargement..."
          className="w-20 h-20 animate-pulse rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={backgroundUpdateProfil}
          alt=""
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <p className="text-red-500 text-lg font-bold drop-shadow-[0_0_10px_#fff]">
          {error}
        </p>
      </div>
    );
  }

  const account = dataProfile?.account;
  const rows = [
    { icon: <HiOutlineLocationMarker />, label: "Adresse", value: account?.address },
    { icon: <HiOutlineMailOpen />, label: "Code postal", value: account?.postalCode },
    { icon: <HiOutlineGlobeAlt />, label: "Pays", value: account?.country },
    { icon: <HiOutlinePhone />, label: "Téléphone", value: account?.phoneNumber },
    { icon: <HiOutlineUser />, label: "Sexe", value: account?.sexe },
    {
      icon: <HiOutlineCake />,
      label: "Date de naissance",
      value: account?.dateOfBorn
        ? new Date(account.dateOfBorn).toLocaleDateString("fr-FR")
        : null,
    },
  ];

  return (
    <div className="relative min-h-screen page-shell">
      <img
        src={backgroundUpdateProfil}
        alt="Arrière-plan"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      <div className="px-4 md:px-10 lg:px-20 max-w-4xl mx-auto flex flex-col gap-6">
        <h1 className="page-title">Mon profil</h1>

        <div className="grid md:grid-cols-[220px_1fr] gap-6 items-start">
          {/* Carte identité */}
          <div className="glass-gold flex flex-col items-center gap-4 p-6 text-center">
            <img
              className="w-28 h-28 rounded-full object-cover border-2 border-white/70"
              src={avatarPreview || account?.avatar || ""}
              alt="Avatar"
            />
            <p className="font-bold text-lg leading-tight">
              {account?.username
                ? account.username.charAt(0).toUpperCase() + account.username.slice(1)
                : "Non renseigné"}
            </p>
            {editMode && (
              <label className="btn-primary inline-flex items-center gap-2 cursor-pointer text-xs px-3 py-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                Changer la photo
              </label>
            )}
          </div>

          {/* Carte infos */}
          <div className="glass-rose p-6">
            {editMode ? (
              <div className="flex flex-col gap-4">
                <input
                  name="username"
                  value={updatedProfile.username ?? account?.username ?? ""}
                  onChange={handleInputChange}
                  placeholder="Nom d'utilisateur"
                  className={inputClass}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="address"
                    value={updatedProfile.address ?? account?.address ?? ""}
                    onChange={handleInputChange}
                    placeholder="Adresse"
                    className={inputClass}
                  />
                  <input
                    name="postalCode"
                    value={updatedProfile.postalCode ?? account?.postalCode ?? ""}
                    onChange={handleInputChange}
                    placeholder="Code postal"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="country"
                    value={updatedProfile.country ?? account?.country ?? ""}
                    onChange={handleInputChange}
                    placeholder="Pays"
                    className={inputClass}
                  />
                  <input
                    name="phoneNumber"
                    value={updatedProfile.phoneNumber ?? account?.phoneNumber ?? ""}
                    onChange={handleInputChange}
                    placeholder="Numéro de téléphone"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    name="sexe"
                    value={updatedProfile.sexe ?? account?.sexe ?? ""}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Sexe
                    </option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <input
                    type="date"
                    name="dateOfBorn"
                    value={
                      updatedProfile.dateOfBorn ??
                      toDateInputValue(account?.dateOfBorn)
                    }
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleSave} className="btn-primary h-11 px-5">
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setUpdatedProfile({});
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="btn-secondary h-11 px-5"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shrink-0 text-white">
                      {row.icon}
                    </span>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">
                        {row.label}
                      </p>
                      <p className="font-semibold">{row.value || "Non renseigné"}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setUpdatedProfile({
                      username: account?.username,
                      address: account?.address ?? undefined,
                      postalCode: account?.postalCode ?? undefined,
                      country: account?.country ?? undefined,
                      phoneNumber: account?.phoneNumber ?? undefined,
                      sexe: account?.sexe ?? undefined,
                      dateOfBorn: toDateInputValue(account?.dateOfBorn),
                      avatar: account?.avatar ?? undefined,
                    });
                    setEditMode(true);
                  }}
                  className="btn-primary h-11 px-5 mt-2 self-start"
                >
                  Modifier mon profil
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="btn-secondary h-11 px-6 self-center"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
