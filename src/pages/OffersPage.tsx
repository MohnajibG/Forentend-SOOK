import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { ProfilProps } from "../types/types";

import backgroundPage from "../assets/img/hero.jpg";
import LOGO from "../assets/img/LOGO.png";

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<ProfilProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );
        setOffers(response.data.offers || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err);
        setError("Impossible de charger les offres.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen grid place-items-center text-white font-[Krub]">
        <img
          className="fixed inset-0 -z-10 w-full h-screen object-cover"
          src={backgroundPage}
          alt="image background"
        />
        Chargement...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-white font-[Krub] mt-20 pb-40 px-4 md:px-8">
      {/* background plein écran */}
      <img
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
        src={backgroundPage}
        alt="image background"
      />

      {error && (
        <div className="text-red-500 text-center font-bold mb-6">{error}</div>
      )}

      {offers.length === 0 ? (
        <p className="text-center">Soyez le premier à publier sur SOOK.</p>
      ) : (
        <div
          className="
            w-full mx-auto max-w-7xl
            p-4 md:p-6 rounded-2xl
            bg-[rgba(240,248,255,0.488)]
            shadow-[0_0_13px_4px_rgba(255,255,255,0.75)]
          "
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer) => (
              <div key={offer._id} className="flex flex-col">
                {/* user row */}
                <div className="w-full flex items-center justify-center gap-3 mb-2">
                  <p className="text-white text-base font-bold">
                    {offer.userId.account
                      ? offer.userId.account.username
                        ? offer.userId.account.username
                            .charAt(0)
                            .toUpperCase() +
                          offer.userId.account.username.slice(1)
                        : "Non spécifié"
                      : "Utilisateur inconnu"}
                  </p>
                  {offer.userId.account?.avatar ? (
                    <img
                      src={offer.userId.account.avatar}
                      alt="Avatar"
                      className="w-[30px] h-[30px] rounded-full border-2 border-[#ffffff69] object-cover"
                    />
                  ) : (
                    <img
                      src={LOGO}
                      alt="avatar"
                      className="w-[30px] h-[30px] rounded-full border-2 border-[#ffffff69] object-cover"
                    />
                  )}
                </div>

                <Link to={`/offer/${offer._id}`} className="group offer-link">
                  <div
                    className="
                      w-full
                      bg-[#ffffffae] rounded-xl
                      shadow-[0_0_13px_4px_rgba(255,255,255,0.75)]
                      hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]
                      transition-transform duration-200
                      group-hover:-translate-y-1
                      p-4 text-center
                    "
                  >
                    <div className="mb-3">
                      <h2
                        className="text-[18px] mb-2"
                        style={{ color: "#333" }}
                      >
                        {offer.title}
                      </h2>
                      <p className="text-[14px]" style={{ color: "#666" }}>
                        {offer.price}€
                      </p>
                    </div>

                    {/* images */}
                    {offer.pictures && offer.pictures.length > 0 && (
                      <div className="flex gap-2 justify-center flex-wrap">
                        {offer.pictures.map((picture, idx) => (
                          <img
                            key={idx}
                            src={picture}
                            alt={`Image de l'offre ${offer._id}`}
                            className="
                              w-full max-h-[50vh] object-contain mt-2
                              rounded-md
                            "
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default OffersPage;
