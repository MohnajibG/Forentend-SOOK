import { useNavigate } from "react-router-dom";

import { useUser } from "../contexts/UserContext";
import useOffers from "../hooks/useOffers";
import useUserInfo from "../hooks/useUserInfo";
import OfferCard from "../components/OfferCard";

import logo from "../assets/img/LOGO.png";
import hero from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username, userId, token } = useUser();

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
        <div
          className="
            glass-rose
            w-[90%] text-center text-[clamp(2rem,8vw,5rem)]
            [text-shadow:0_0_10px_rgba(255,255,255,0.8)]
            px-4 py-6 md:py-8
          "
        >
          <h1 className="leading-none font-bold ">
            <span className="text-[#ed749d] align-middle">|</span>
            SOOK !<span className="text-[#ab6415] align-middle">|</span>
          </h1>
        </div>

        {/* Message d'accueil */}
        {username ? (
          <div
            className="
              glass-gold
              w-[90%] flex flex-col items-center justify-center text-center
              px-6 md:px-10 py-12
            "
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-5">
                <h2 className="text-2xl md:text-3xl mb-2">
                  Hello{" "}
                  {username.charAt(0).toUpperCase() +
                    username.slice(1).toLowerCase()}
                  !
                </h2>

                {userInfo?.account?.avatar ? (
                  <img
                    src={userInfo.account.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-[#ccc]"
                  />
                ) : (
                  <img
                    src={logo}
                    alt="Avatar par défaut"
                    className="w-12 h-12 rounded-full object-cover border border-[#ccc]"
                    style={{ filter: "blur(10%)" }}
                  />
                )}
              </div>

              <p className="text-base hover:text-black hover:font-normal transition-colors duration-[3000ms]">
                Profitez de nos fonctionnalités !
              </p>

              <button
                className="
                  mt-2 h-12 px-6
                  bg-[rgba(133,149,166,0.618)] text-white font-bold
                  rounded
                  transition-colors
                  hover:bg-[rgba(249,200,208,0.8)]
                "
                onClick={() => navigate("/publish")}
              >
                Publier un article
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
            <h2 className="text-2xl md:text-3xl mb-3">Bienvenue!</h2>
            <p className="text-base mb-4 hover:text-black hover:font-normal transition-colors duration-[3000ms]">
              Pour accéder à plus de fonctionnalités, veuillez :
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

        {/* Offres disponibles */}
        <div
          className="
    glass-rose
    w-full max-w-6xl
    px-3 md:px-4 py-10
    flex flex-wrap gap-3 items-center justify-between
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
