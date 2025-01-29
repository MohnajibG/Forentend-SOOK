import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProfilProps } from "../types/types";
import { Link } from "react-router-dom";
import "../assets/styles/header.css";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  const [searchResults, setSearchResults] = useState<ProfilProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim()) {
        console.log("🔍 Recherche envoyée :", search);
        setIsLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            "https://site--sook--dnxhn8mdblq5.code.run/offers",
            {
              params: { title: search.trim() },
            }
          );

          console.log("📩 Réponse API :", response.data);

          const offers = response.data.offers || [];
          const filteredResults = offers.filter((offer: { title: string }) =>
            offer.title.toLowerCase().includes(search.toLowerCase())
          );

          setSearchResults(filteredResults);
          setIsSearchOpen(true);
        } catch (error) {
          setError("Une erreur est survenue lors de la recherche.");
          setSearchResults([]);
        }

        setIsLoading(false);
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    };

    fetchData();
  }, [search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="search-container">
      <input
        ref={searchRef}
        className="search"
        type="text"
        value={search}
        onChange={handleSearch}
        onClick={() => setIsSearchOpen(true)}
        placeholder="Recherche..."
        aria-label="Champ de recherche"
      />
      {isLoading && <div className="loading">Chargement...</div>}
      {error && <div className="error">{error}</div>}
      {isSearchOpen && (
        <div className="search-results">
          {searchResults.length > 0 &&
            searchResults.map((result) => (
              <Link
                to={`/offer/${result._id}`}
                key={result._id}
                className="search-result"
              >
                <img
                  src={result.pictures ? result.pictures[0] : ""}
                  alt={result.title || "No title available"}
                  width={50}
                  height={50}
                />
                <div>
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                  <p>Prix : {result.price}€</p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
