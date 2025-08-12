import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProfilProps } from "../types/types";
import { Link } from "react-router-dom";

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
        const { data } = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers",
          { params: { title: q } }
        );
        const offers: ProfilProps[] = data.offers || [];
        const filtered = offers.filter((o) =>
          (o.title || "").toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(filtered);
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
      className="w-full flex flex-col items-center gap-2"
      role="search"
      aria-label="Recherche d'offres"
    >
      <input
        ref={inputRef}
        className="
          w-[80vw] md:w-[70vw] lg:w-[60vw]
          h-10 rounded-md px-4
          bg-[#dbc4b8ec] hover:bg-[#eee5e0]
          outline-none border-0 transition-colors
          text-black placeholder-black/60
        "
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search.trim() && setIsSearchOpen(true)}
        placeholder="Recherche..."
        aria-label="Champ de recherche"
      />

      {/* Loading / Error */}
      {isSearchOpen && (
        <div
          className="
            w-[80vw] md:w-[70vw] lg:w-[60vw]
            bg-white/90 rounded-lg shadow-lg
            max-h-[60vh] overflow-auto
          "
        >
          {isLoading && (
            <div className="p-3 text-center text-sm text-black/70">
              Chargement...
            </div>
          )}

          {error && !isLoading && (
            <div className="p-3 text-center text-sm text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="p-3 text-center text-sm text-black/60">
              Aucun résultat.
            </div>
          )}

          {/* Résultats */}
          {searchResults.length > 0 &&
            searchResults.map((result) => (
              <Link
                to={`/offer/${result._id}`}
                key={result._id}
                className="
                  flex gap-4 items-center
                  p-3 border-t border-black/10
                  hover:bg-black/[.04] transition-colors
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
                  className="w-[50px] h-[50px] object-cover rounded"
                  width={50}
                  height={50}
                />
                <div className="flex-1 text-black">
                  <h3 className="font-semibold leading-tight">
                    {result.title}
                  </h3>
                  <p className="text-sm line-clamp-2 text-black/80">
                    {result.description}
                  </p>
                  <p className="text-sm font-medium text-black/70">
                    Prix : {result.price}€
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
