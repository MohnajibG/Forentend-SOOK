import { useState, useEffect } from "react";
import axios from "axios";

const useOffers = () => {
  const [dataOffer, setDataOffer] = useState<{ offers: any[] }>({ offers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataOffer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );
        setDataOffer(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres:", err);
        setError("Une erreur est survenue lors du chargement des offres.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataOffer();
  }, []);

  return { dataOffer, isLoading, error };
};
export default useOffers;
