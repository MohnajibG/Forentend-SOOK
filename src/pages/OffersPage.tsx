import axios from "axios";
import { useEffect, useState } from "react";

import { ProfilProps } from "../types/types";
import OfferCard from "../components/OfferCard";
import usePageTitle from "../hooks/usePageTitle";
import { API_URL } from "../settings/api";

import backgroundPage from "../assets/img/hero.jpg";

const OffersPage: React.FC = () => {
  usePageTitle("Toutes les offres");
  const [offers, setOffers] = useState<ProfilProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_URL}/offers`);
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
      <main className="relative min-h-screen grid place-items-center">
        <img
          className="fixed inset-0 -z-10 w-full h-screen object-cover"
          src={backgroundPage}
          alt="image background"
        />
        Chargement des offres...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 md:px-8 page-shell">
      {/* background plein écran */}
      <img
        className="fixed inset-0 -z-10 w-full h-screen object-cover"
        src={backgroundPage}
        alt="image background"
      />

      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="page-title">Toutes les offres</h1>
        <p className="page-subtitle">
          {offers.length} article{offers.length > 1 ? "s" : ""} disponible
          {offers.length > 1 ? "s" : ""} en ce moment
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-center font-bold mb-6">{error}</div>
      )}

      {offers.length === 0 ? (
        <p className="text-center text-lg">
          Soyez le premier à publier sur SOOK.
        </p>
      ) : (
        <div className="w-full mx-auto max-w-7xl p-4 md:p-6">
          <div className="flex flex-wrap gap-6 justify-center">
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
