import { Key } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useUser } from "../contexts/UserContext";

import useOffers from "../hooks/useOffers";
import useUserInfo from "../hooks/useUserInfo";

import logo from "../assets/img/LOGO.png";
import hero from "../assets/img/hero.jpg";
import Loading from "../assets/img/Loading.gif";

import "../assets/styles/home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username, userId, token } = useUser();

  const { dataOffer, isLoading, error } = useOffers();
  const { userInfo } = useUserInfo(userId, token);

  if (isLoading) {
    return (
      <div className="Load">
        <img src={Loading} alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <div className="hero">
        <img src={hero} alt="Hero" />
      </div>

      <div className="home-container">
        {/* Titre principal */}
        <div className="home-page-title">
          <h1>
            <span className="left-bar">|</span>SOOK !
            <span className="right-bar">|</span>
          </h1>
        </div>

        {/* Message d'accueil */}
        {username ? (
          <div className="welcom-container">
            <div className="user-home">
              <h2>
                Hello{" "}
                {username.charAt(0).toUpperCase() +
                  username.slice(1).toLowerCase()}
                !
              </h2>

              {userInfo.account?.avatar ? (
                <img
                  src={userInfo.account.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              ) : (
                <img
                  src={logo}
                  alt="Avatar par défaut"
                  className="avatar"
                  style={{ filter: "blur(10%)" }}
                />
              )}
            </div>

            <p>Profitez de nos fonctionnalités !</p>
            <button className="home-btn" onClick={() => navigate("/publish")}>
              Publier un article
            </button>
          </div>
        ) : (
          <div className="welcom-container">
            <h2>Bienvenue!</h2>
            <p>Pour accéder à plus de fonctionnalités, veuillez :</p>
            <div>
              <button className="home-btn" onClick={() => navigate("/login")}>
                Se connecter
              </button>
              <span> ou </span>
              <button className="home-btn" onClick={() => navigate("/signup")}>
                S'inscrire
              </button>
            </div>
          </div>
        )}

        {/* Offres disponibles */}
        <div className="offer-home">
          {dataOffer.offers.map((offer) => (
            <Link key={offer._id} to={`/offer/${offer._id}`}>
              <div className="offer-items">
                <div>
                  <h2>{offer.title}</h2>
                  <div>
                    <p>Prix : {offer.price}€</p>
                    <p>Marque : {offer.brand}</p>
                  </div>

                  <div className="userInfo">
                    {offer.userId?.account?.username ? (
                      <p>
                        {offer.userId.account.username.charAt(0).toUpperCase() +
                          offer.userId.account.username.slice(1)}
                      </p>
                    ) : (
                      <p>Utilisateur inconnu</p>
                    )}
                    {offer.userId?.account?.avatar && (
                      <img
                        src={offer.userId.account.avatar}
                        alt="Avatar utilisateur"
                        className="avatar"
                      />
                    )}
                  </div>
                </div>

                {/* Images de l'offre */}
                {offer.pictures && offer.pictures.length > 0 && (
                  <div className="pictures-offer">
                    {offer.pictures.map(
                      (
                        picture: string | undefined,
                        index: Key | null | undefined
                      ) =>
                        picture && (
                          <img
                            key={index}
                            src={picture}
                            alt={`Image de l'offre ${offer._id}`}
                            className="offer-image"
                          />
                        )
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
