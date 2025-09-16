import axios from "axios";
import { useEffect, useState } from "react";

import { ProfilProps } from "../types/types";
import OfferCard from "../components/OfferCard"; // <-- importer ton composant

import backgroundPage from "../assets/img/hero.jpg";

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
      <main className="relative min-h-screen grid place-items-center text-white font-[Space Grotesk]">
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
    <main className="relative min-h-screen text-3xl text-white font-[Space Grotesk] pb-40 px-4 md:px-8 my-15">
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
          <div className="flex flex-wrap gap-20 justify-center">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default OffersPage;
