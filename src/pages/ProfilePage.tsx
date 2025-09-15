import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Account, ProfilProps } from "../types/types";
import { useUser } from "../contexts/UserContext";

import backgroundUpdateProfil from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

const ProfilePage: React.FC = () => {
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
          `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
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
        alert("Erreur lors de l'upload de l'image");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (
        !updatedProfile.address ||
        !updatedProfile.phoneNumber ||
        !updatedProfile.country
      ) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      if (!token || !userId) {
        alert("Vous devez être connecté pour mettre à jour votre profil.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      if (avatarFile) formData.append("avatar", avatarFile);
      Object.keys(updatedProfile).forEach((key) =>
        formData.append(
          key,
          updatedProfile[key as keyof typeof updatedProfile] as string
        )
      );

      const res = await axios.put(
        `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
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
    } catch (e) {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-white font-[Krub]">
        <img
          src={backgroundUpdateProfil}
          alt=""
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <img
          src={Loading}
          alt="Loading..."
          className="w-20 h-20 animate-pulse rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-white font-[Krub]">
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

  return (
    <div className="relative min-h-screen text-white font-[Krub] my-15">
      <img
        src={backgroundUpdateProfil}
        alt="Background Update Profil"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      <div className="px-4 md:px-10 lg:px-20 pt-24 pb-36 flex flex-col items-center gap-10">
        <h1 className="text-center text-5xl font-bold text-[#fef2f2]">
          VOTRE PROFIL
        </h1>

        <div
          className="
            flex flex-col items-center
            w-full max-w-4xl
            bg-[#f3f3f399]/[.99]
            backdrop-blur-sm
            shadow-[0_10px_30px_rgba(0,0,0,0.25)]
            p-4 md:p-8
          "
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            {/* Avatar */}
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
              <img
                className="w-40 h-40 md:w-44 md:h-44 rounded-full object-cover border border-[#ccc]"
                src={avatarPreview || dataProfile?.account?.avatar || ""}
                alt="Avatar"
              />
              {editMode && (
                <>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold px-3 py-2 bg-[#dfa080bd] hover:bg-[#c87660] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    Changer l’avatar
                  </label>
                  {avatarFile && (
                    <p className="text-sm text-white/80">
                      Avatar sélectionné : {avatarFile.name}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Infos utilisateur */}
            <div className="flex-1 flex flex-col gap-4 md:pl-6 border-t md:border-t-0 md:border-l md:border-[#30303096] pt-4 md:pt-0">
              {editMode ? (
                <>
                  <div className="flex flex-col gap-4">
                    <input
                      name="username"
                      value={
                        updatedProfile.username ||
                        dataProfile?.account?.username ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Nom d'utilisateur"
                      className="h-11 px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <input
                      name="address"
                      value={
                        updatedProfile.address ||
                        dataProfile?.account?.address ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Adresse"
                      className="h-11 px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <input
                      name="postalCode"
                      value={
                        updatedProfile.postalCode ||
                        dataProfile?.account?.postalCode ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Code postal"
                      className="h-11 px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <input
                      name="country"
                      value={
                        updatedProfile.country ||
                        dataProfile?.account?.country ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Pays"
                      className="h-11 px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <input
                      name="phoneNumber"
                      value={
                        updatedProfile.phoneNumber ||
                        dataProfile?.account?.phoneNumber ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Numéro de téléphone"
                      className="h-11 px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <select
                      name="sexe"
                      value={
                        updatedProfile.sexe || dataProfile?.account?.sexe || ""
                      }
                      onChange={handleInputChange}
                      className="h-11 px-3 bg-white/90 text-black outline-none"
                    >
                      <option value="" disabled>
                        Sélectionnez votre sexe
                      </option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                      <option value="autre">Autre</option>
                    </select>
                    <input
                      type="date"
                      name="dateOfBorn"
                      value={
                        updatedProfile.dateOfBorn ||
                        dataProfile?.account?.dateOfBorn ||
                        ""
                      }
                      onChange={handleInputChange}
                      className="h-11 px-3 bg-white/90 text-black outline-none"
                    />

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="h-11 px-5 font-bold bg-[#dfa080bd] hover:bg-[#c87660] text-white transition-colors"
                      >
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
                        className="h-11 px-5 font-bold bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <p>
                    <span className="opacity-60">Nom d'utilisateur :</span>{" "}
                    {dataProfile?.account?.username
                      ? dataProfile.account.username.charAt(0).toUpperCase() +
                        dataProfile.account.username.slice(1)
                      : "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Adresse :</span>{" "}
                    {dataProfile?.account?.address || "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Code postal :</span>{" "}
                    {dataProfile?.account?.postalCode || "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Pays :</span>{" "}
                    {dataProfile?.account?.country || "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Numéro de téléphone :</span>{" "}
                    {dataProfile?.account?.phoneNumber || "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Sexe :</span>{" "}
                    {dataProfile?.account?.sexe || "Non renseigné"}
                  </p>
                  <p>
                    <span className="opacity-60">Date de naissance :</span>{" "}
                    {dataProfile?.account?.dateOfBorn
                      ? new Date(
                          dataProfile.account.dateOfBorn
                        ).toLocaleDateString("fr-FR")
                      : "Non renseigné"}
                  </p>

                  <button
                    onClick={() => {
                      setUpdatedProfile({
                        username: dataProfile?.account?.username,
                        address: dataProfile?.account?.address ?? undefined,
                        postalCode:
                          dataProfile?.account?.postalCode ?? undefined,
                        country: dataProfile?.account?.country ?? undefined,
                        phoneNumber:
                          dataProfile?.account?.phoneNumber ?? undefined,
                        sexe: dataProfile?.account?.sexe ?? undefined,
                        dateOfBorn:
                          dataProfile?.account?.dateOfBorn ?? undefined,
                        avatar: dataProfile?.account?.avatar ?? undefined,
                      });
                      setEditMode(true);
                    }}
                    className="h-11 px-5 font-bold bg-[#dfa080bd] hover:bg-[#c87660] text-white transition-colors mx-10"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="h-11 px-6 font-bold bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
