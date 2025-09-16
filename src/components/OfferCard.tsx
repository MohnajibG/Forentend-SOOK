// src/components/OfferCard.tsx
import { Link } from "react-router-dom";
import { ProfilProps } from "../types/types";
import LOGO from "../assets/img/LOGO.png";

interface OfferCardProps {
  offer: ProfilProps;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div className="flex flex-col w-full sm:w-[48%] lg:w-[30%] xl:w-[22%]">
      <Link to={`/offer/${offer._id}`} className="group offer-link">
        <div
          className="
            w-full
            bg-[#ffffffae] rounded-xl
            shadow-[0_0_13px_4px_rgba(255,255,255,0.75)]
            hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]
            transition-transform duration-200
            group-hover:-translate-y-1
            p-2 text-center
          "
        >
          <div className="w-full flex items-center justify-between mb-2">
            <p className="text-gray-900 text-base font-bold">
              {offer.userId.account?.username
                ? offer.userId.account.username.charAt(0).toUpperCase() +
                  offer.userId.account.username.slice(1)
                : "Utilisateur inconnu"}
            </p>
            {offer.userId.account?.avatar ? (
              <img
                src={offer.userId.account.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-[#ffffff69] object-cover"
              />
            ) : (
              <img
                src={LOGO}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-[#ffffff69] object-cover"
              />
            )}
          </div>

          <div className="mb-3">
            <h2 className="text-[18px] mb-2 text-gray-800">{offer.title}</h2>
            <p className="text-[14px] text-gray-600">{offer.price}€</p>
          </div>

          {offer.pictures && offer.pictures.length > 0 && (
            <div className="relative w-full">
              <div
                className="
                  w-full flex overflow-x-auto
                  snap-x snap-mandatory
                  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                "
              >
                {offer.pictures.map((picture, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full flex justify-center snap-center"
                  >
                    <img
                      src={picture}
                      alt={`Image de ${offer.title}`}
                      className="w-64 h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default OfferCard;
