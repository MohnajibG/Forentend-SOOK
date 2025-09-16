import { Key } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useUser } from "../contexts/UserContext";
import useOffers from "../hooks/useOffers";
import useUserInfo from "../hooks/useUserInfo";

import logo from "../assets/img/LOGO.png";
import hero from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";
import OfferCard from "../components/OfferCard";

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
    <main className="relative min-h-screen text-white font-[Space Grotesk] my-20 mx-4 md:mx-20 lg:mx-24 pb-40">
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
            w-[90%] text-center text-[clamp(2rem,8vw,5rem)]
            [text-shadow:0_0_10px_rgba(255,255,255,0.8)]
            bg-[rgba(249,200,208,0.4)]
            shadow-[0_0_13px_4px_rgba(255,255,255,0.75)]
            px-4 py-6 md:py-8
            transition-colors duration-1000
            hover:bg-[rgba(249,200,208,0.66)]
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
              w-[90%] flex flex-col items-center justify-center text-center
              text-white px-6 md:px-10 py-12
              bg-[rgba(227,192,153,0.591)]
              shadow-[0_0_13px_4px_rgba(251,209,168,0.412)]
              cursor-default
              transition-colors duration-1000
              hover:bg-[rgba(253,219,185,0.659)]
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
                  mt-2 h-12 w-40
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
              w-[90%] flex flex-col items-center justify-center text-center
              text-white px-6 md:px-10 py-12
              bg-[rgba(227,192,153,0.591)]
              shadow-[0_0_13px_4px_rgba(251,209,168,0.412)]
              cursor-default
              transition-colors duration-1000
              hover:bg-[rgba(253,219,185,0.659)]
            "
          >
            <h2 className="text-2xl md:text-3xl mb-3">Bienvenue!</h2>
            <p className="text-base mb-4 hover:text-black hover:font-normal transition-colors duration-[3000ms]">
              Pour accéder à plus de fonctionnalités, veuillez :
            </p>
            <div className="flex items-center gap-2">
              <button
                className="
                  h-12 w-40
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
                  h-12 w-40
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
    w-full mx-auto max-w-7xl
    p-4 md:p-6 rounded-2xl
    bg-[rgba(240,248,255,0.488)]
    shadow-[0_0_13px_4px_rgba(255,255,255,0.75)]
  "
        >
          <div className="flex flex-wrap gap-20 justify-center">
            {dataOffer?.offers?.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
