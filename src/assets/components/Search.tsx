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
    if (search.trim()) {
      const fetchData = async () => {
        setIsLoading(true); // Début du chargement
        try {
          const response = await axios.get(
            `https://site--sook--dnxhn8mdblq5.code.run/offers?title=${search}`
          );
          setSearchResults(response.data.offers || []); // Met à jour les résultats
          setIsSearchOpen(true); // Affiche les résultats
        } catch (error) {
          console.error("Erreur lors de la recherche :", error);
          setSearchResults([]); // Vide les résultats en cas d'erreur
        }
        setIsLoading(false); // Fin du chargement
      };

      fetchData();
    } else {
      setSearchResults([]);
      setIsSearchOpen(false); // Ferme les résultats
    }
  }, [search]);

  return (
    <div className="search-container">
      <input
        ref={searchRef}
        className="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClick={() => setIsSearchOpen(true)}
        placeholder="Recherche"
        aria-label="Champ de recherche"
      />
      {isLoading && <div className="loading">Chargement...</div>}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
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
