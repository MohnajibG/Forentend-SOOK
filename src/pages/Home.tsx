import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiList, FiShoppingBag } from "react-icons/fi";

import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import useOffers from "../hooks/useOffers";
import useUserInfo from "../hooks/useUserInfo";
import usePageTitle from "../hooks/usePageTitle";
import OfferCard from "../components/OfferCard";

import logo from "../assets/img/LOGO.png";
import hero from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

const Home: React.FC = () => {
  usePageTitle("Accueil");
  const navigate = useNavigate();
  const { username, userId, token } = useUser();
  const { cart } = useCart();

  const { dataOffer, isLoading, error } = useOffers();
  const { userInfo } = useUserInfo(userId, token);

  if (isLoading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/30">
        <img
          src={Loading}
          alt="Loading..."
          className="w-20 h-20 animate-pulse rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-white">{error}</p>;
  }

  return (
    <main className="relative min-h-screen mx-4 md:mx-20 lg:mx-24 page-shell">
      {/* background hero plein écran, fixé */}
      <img
        src={hero}
        alt="Hero"
        className="fixed inset-0 -z-10 w-screen h-screen object-cover"
      />

      <div className="flex flex-col items-center justify-start gap-8 md:gap-10 px-4 md:px-10 lg:px-20 py-20">
        {/* Titre principal */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-6">
          <div
            className=" 
            glass-rose  
            w-[90%] text-center text-[clamp(2rem,8vw,5rem)]
            [text-shadow:0_0_10px_rgba(255,255,255,0.8)]
            py-6 md:py-40
            md:rounded-full
          "
          >
            <h1 className="leading-none font-bold ">
              <span className="text-[#ed749d] align-middle">|</span>
              SOOK !<span className="text-[#ab6415] align-middle">|</span>
            </h1>
          </div>

          {/* Message d'accueil */}
          {username ? (
            <div className="glass-gold w-[90%] max-w-xl px-6 md:px-10 py-8 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-4">
                {userInfo?.account?.avatar ? (
                  <img
                    src={userInfo.account.avatar}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/70"
                  />
                ) : (
                  <img
                    src={logo}
                    alt="Avatar par défaut"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/70"
                  />
                )}
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Bon retour,{" "}
                    {username.charAt(0).toUpperCase() +
                      username.slice(1).toLowerCase()}{" "}
                    !
                  </h2>
                  <p className="text-sm text-white/75">
                    Qu'est-ce qu'on fait aujourd'hui ?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full">
                <button
                  onClick={() => navigate("/publish")}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white/25 hover:bg-white/40 transition-colors py-3.5"
                >
                  <FiPlusCircle size={20} />
                  <span className="text-xs font-semibold">Publier</span>
                </button>
                <button
                  onClick={() => navigate("/mesoffres")}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white/25 hover:bg-white/40 transition-colors py-3.5"
                >
                  <FiList size={20} />
                  <span className="text-xs font-semibold">Mes annonces</span>
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="relative flex flex-col items-center gap-1.5 rounded-xl bg-white/25 hover:bg-white/40 transition-colors py-3.5"
                >
                  <FiShoppingBag size={20} />
                  <span className="text-xs font-semibold">Panier</span>
                  {cart.length > 0 && (
                    <span className="absolute top-2 right-2 bg-[#e60000] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="
              glass-gold
              w-[90%] flex flex-col items-center justify-center text-center
              px-6 md:px-10 py-12
            "
            >
              <h2 className="text-2xl md:text-3xl mb-3">
                Bienvenue sur SOOK !
              </h2>
              <p className="text-base mb-4">
                Connectez-vous pour publier vos articles, gérer votre panier et
                suivre vos annonces.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  className="
                  h-12 px-6
                  bg-[rgba(133,149,166,0.618)] text-white font-bold
                  rounded
                  transition-colors
                  hover:bg-[rgba(249,200,208,0.8)]
                "
                  onClick={() => navigate("/login")}
                >
                  Se connecter
                </button>
                <span className="mx-1">ou</span>
                <button
                  className="
                  h-12 px-6
                  bg-[rgba(133,149,166,0.618)] text-white font-bold
                  rounded
                  transition-colors
                  hover:bg-[rgba(249,200,208,0.8)]
                "
                  onClick={() => navigate("/signup")}
                >
                  S'inscrire
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Offres disponibles */}
        <div className="w-full max-w-6xl">
          <h2 className="page-title text-white">Offres du moment</h2>
        </div>
        <div
          className="
 
    w-full max-w-6xl
    px-3 md:px-4 py-10
    flex flex-wrap gap-6 items-center justify-between
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
  "
        >
          {dataOffer?.offers?.map((offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
