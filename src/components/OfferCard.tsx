// src/components/OfferCard.tsx
import { Link } from "react-router-dom";
import { ProfilProps } from "../types/types";
import LOGO from "../assets/img/LOGO.png";

interface OfferCardProps {
  offer: ProfilProps;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const avatar = offer.userId?.account?.avatar || LOGO;
  const username = offer.userId?.account?.username
    ? offer.userId.account.username.charAt(0).toUpperCase() +
      offer.userId.account.username.slice(1)
    : "Utilisateur inconnu";

  return (
    <div className="flex flex-col w-full sm:w-[48%] lg:w-[30%] xl:w-[22%]">
      <Link to={`/offer/${offer._id}`} className="glass-card block">
        {/* Photo(s) : carrousel scrollable, images centrées */}
        <div className="relative aspect-square">
          {offer.condition && (
            <span className="glass-badge absolute top-3 left-3 z-10">
              {offer.condition}
            </span>
          )}

          {offer.pictures && offer.pictures.length > 0 ? (
            <div
              className="
                w-full h-full flex overflow-x-auto snap-x snap-mandatory
                scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent
              "
            >
              {offer.pictures.map((picture, idx) => (
                <img
                  key={idx}
                  src={picture}
                  alt={`${offer.title || "Offre"} — photo ${idx + 1}`}
                  className="w-full h-full flex-shrink-0 object-cover snap-center"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10 text-sm text-white/60">
              Pas d'image
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-4 text-left">
          {offer.brand && (
            <p className="text-xs font-bold uppercase tracking-wide text-sook-dore">
              {offer.brand}
            </p>
          )}
          <h2 className="text-base font-semibold mt-1 mb-2 truncate">
            {offer.title}
          </h2>
          <p className="text-lg font-bold">{offer.price}€</p>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/25">
            <img
              src={avatar}
              alt={username}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-white/80 truncate">
              {username}
              {offer.city ? ` · ${offer.city}` : ""}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OfferCard;
