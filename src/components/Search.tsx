import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProfilProps } from "../types/types";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { API_URL } from "../settings/api";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  const [searchResults, setSearchResults] = useState<ProfilProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer au clic extérieur + ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Appel API (simple) à chaque changement — tu peux ajouter un debounce si besoin
  useEffect(() => {
    const fetchData = async () => {
      const q = search.trim();
      if (!q) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_URL}/offers/search`, {
          params: { keyword: q },
        });
        setSearchResults(data.offers || []);
        setIsSearchOpen(true);
      } catch (e) {
        setError("Une erreur est survenue lors de la recherche.");
        setSearchResults([]);
        setIsSearchOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      role="search"
      aria-label="Recherche d'offres"
    >
      <div className="relative w-full">
        <HiOutlineSearch
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#4a2c1d]/60 shrink-0"
          size={17}
        />
        <input
          ref={inputRef}
          className="
            w-full h-10 sm:h-11 pl-9 sm:pl-11 pr-8 sm:pr-10
            bg-white/95 hover:bg-white focus:bg-white
            rounded-full outline-none border border-white/40
            text-[#241118] placeholder-[#4a2c1d]/50 text-sm
            transition-colors focus:ring-2 focus:ring-[#cf9a3f]/60
          "
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.trim() && setIsSearchOpen(true)}
          placeholder="Rechercher..."
          aria-label="Champ de recherche"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Effacer la recherche"
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#4a2c1d]/50 hover:text-[#4a2c1d]"
          >
            <HiX size={16} />
          </button>
        )}
      </div>

      {/* Résultats : en absolu, ne pousse jamais le reste du header */}
      {isSearchOpen && (
        <div className="glass-rose absolute left-0 right-0 top-[calc(100%+10px)] max-h-[60vh] overflow-auto z-50">
          {isLoading && (
            <div className="p-3 text-center text-sm text-white/80">
              Recherche en cours...
            </div>
          )}

          {error && !isLoading && (
            <div className="p-3 text-center text-sm text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="p-3 text-center text-sm text-white/70">
              Aucun résultat pour cette recherche.
            </div>
          )}

          {searchResults.length > 0 &&
            searchResults.map((result) => (
              <Link
                to={`/offer/${result._id}`}
                key={result._id}
                className="
                  flex gap-4 items-center
                  p-3 border-t border-white/20 first:border-t-0
                  hover:bg-white/10 transition-colors
                "
                onClick={() => setIsSearchOpen(false)}
              >
                <img
                  src={
                    result.pictures && result.pictures.length > 0
                      ? result.pictures[0]
                      : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'50'%20height%3D'50'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20width%3D'50'%20height%3D'50'%20fill%3D'%23eee'/%3E%3C/svg%3E"
                  }
                  alt={result.title || "Pas de titre"}
                  className="w-[50px] h-[50px] object-cover rounded-lg"
                  width={50}
                  height={50}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight truncate">
                    {result.title}
                  </h3>
                  <p className="text-sm line-clamp-1 text-white/75">
                    {result.description}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#e6c27a] shrink-0">
                  {result.price} €
                </p>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
