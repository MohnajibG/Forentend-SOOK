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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarFile(f);
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
    } catch (e) {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen grid place-items-center text-white font-[Krub]">
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
      <div className="relative min-h-screen text-white font-[Krub] grid place-items-center">
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
    <div className="relative min-h-screen text-white font-[Krub] ">
      {/* Background */}
      <img
        src={backgroundUpdateProfil}
        alt="Background Update Profil"
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
      />

      <div className="px-4 md:px-10 lg:px-20 pt-24 pb-36 flex flex-col *: items-center gap-10">
        <h1 className="text-center text-5xl font-bold  text-[#fef2f2] ">
          VOTRE PROFIL
        </h1>

        {/* Carte profil */}
        <div
          className="
            w-full max-w-4xl
            bg-[#f3f3f399]/[.99]
            backdrop-blur-sm
            rounded-2xl
            shadow-[0_10px_30px_rgba(0,0,0,0.25)]
            p-4 md:p-8
          "
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Avatar + upload */}
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
              <div className="relative">
                <img
                  className="
                    w-40 h-40 md:w-44 md:h-44 rounded-full object-cover
                    border border-[#ccc]
                  "
                  src={dataProfile?.account?.avatar || ""}
                  alt="Avatar"
                />
                {/* liseré bas rouge semi-transp */}
                <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-[#f5060696] rounded-full" />
              </div>

              {editMode && (
                <label
                  className="
                    inline-flex items-center gap-2 cursor-pointer
                    text-sm font-bold
                    px-3 py-2 rounded
                    bg-[#dfa080bd] hover:bg-[#c87660] transition-colors
                  "
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  Changer l’avatar
                </label>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1">
              {/* colonne avec séparateur gauche */}
              <div className="md:border-l md:border-[#30303096] md:pl-6 flex flex-col gap-4">
                {editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="username"
                      value={
                        updatedProfile.username ||
                        dataProfile?.account?.username ||
                        ""
                      }
                      onChange={handleInputChange}
                      placeholder="Nom d'utilisateur"
                      className="h-11 rounded px-3 bg-white/90 text-black placeholder-black/60 outline-none"
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
                      className="h-11 rounded px-3 bg-white/90 text-black placeholder-black/60 outline-none"
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
                      className="h-11 rounded px-3 bg-white/90 text-black placeholder-black/60 outline-none"
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
                      className="h-11 rounded px-3 bg-white/90 text-black placeholder-black/60 outline-none"
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
                      className="h-11 rounded px-3 bg-white/90 text-black placeholder-black/60 outline-none"
                    />
                    <select
                      name="sexe"
                      value={
                        updatedProfile.sexe || dataProfile?.account?.sexe || ""
                      }
                      onChange={handleInputChange}
                      className="h-11 rounded px-3 bg-white/90 text-black outline-none"
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
                      className="h-11 rounded px-3 bg-white/90 text-black outline-none"
                    />
                    <div className="col-span-1 md:col-span-2 text-sm text-white/80">
                      {avatarFile && (
                        <p>Avatar sélectionné : {avatarFile.name}</p>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="
                          h-11 px-5 rounded font-bold
                          bg-[#dfa080bd] hover:bg-[#c87660]
                          text-white transition-colors
                        "
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setUpdatedProfile({});
                          setAvatarFile(null);
                        }}
                        className="
                          h-11 px-5 rounded font-bold
                          bg-white/20 hover:bg-white/30
                          text-white transition-colors
                        "
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>
                      <span className="opacity-80">Nom d'utilisateur :</span>{" "}
                      {dataProfile?.account?.username || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Adresse :</span>{" "}
                      {dataProfile?.account?.address || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Code postal :</span>{" "}
                      {dataProfile?.account?.postalCode || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Pays :</span>{" "}
                      {dataProfile?.account?.country || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Numéro de téléphone :</span>{" "}
                      {dataProfile?.account?.phoneNumber || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Sexe :</span>{" "}
                      {dataProfile?.account?.sexe || "Non renseigné"}
                    </p>
                    <p>
                      <span className="opacity-80">Date de naissance :</span>{" "}
                      {dataProfile?.account?.dateOfBorn || "Non renseigné"}
                    </p>

                    <div className="pt-3">
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
                        className="
                          h-11 px-5 rounded font-bold
                          bg-[#dfa080bd] hover:bg-[#c87660]
                          text-white transition-colors
                        "
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <button
          onClick={() => navigate("/home")}
          className="
            h-11 px-6 rounded font-bold
            bg-white/20 hover:bg-white/30
            text-white transition-colors
          "
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
