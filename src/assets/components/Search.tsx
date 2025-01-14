import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProfilProps } from "../../types/types";
import "../styles/header.css";
import { Link } from "react-router-dom";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  const [searchResults, setSearchResults] = useState<ProfilProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim()) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://site--sook--dnxhn8mdblq5.code.run/offers?title=${encodeURIComponent(
              search
            )}`
          );
          console.log("API Response:", response.data);
          const offers = response.data.offers || [];
          setSearchResults(Array.isArray(offers) ? offers : []);
          setIsSearchOpen(true);
        } catch (error) {
          console.error("Erreur lors de la recherche :", error);
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
    setSearch(event.target.value); // Mettre à jour le champ de recherche
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
        placeholder="Recherche"
        aria-label="Champ de recherche"
      />
      {isLoading && <div className="loading">Chargement...</div>}
      {isSearchOpen && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults
              .filter((val) =>
                val.title?.toLowerCase().includes(search.toLowerCase())
              )
              .map((result) => (
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
              ))
          ) : (
            <p>Aucun résultat trouvé.</p> // Message lorsque la recherche ne retourne rien
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
