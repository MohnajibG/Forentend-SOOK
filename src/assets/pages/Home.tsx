import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../img/LOGO.png";
import hero from "../img/hero.jpg";
import "../styles/home.css";
import { useUser } from "../contexts/UserContext";
import { ProfilProps } from "../../types/types";
import Loading from "../img/Loading.gif";

const Home: React.FC = () => {
  const [dataOffer, setDataOffer] = useState<{ offers: ProfilProps[] }>({
    offers: [],
  });
  const [userInfo, setUserInfo] = useState<{
    account: any;
    username: string | null;
    avatar: string | null;
  }>({
    account: null,
    username: null,
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { username, userId, token } = useUser();

  useEffect(() => {
    const fetchDataOffer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/offers"
        );

        setDataOffer(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur est survenue lors du chargement des offres.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataOffer();
  }, []);

  // Nouveau useEffect pour récupérer les informations de l'utilisateur
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Ajout du token Bearer dans l'en-tête
              },
            }
          );
          setUserInfo(response.data);
        } catch (err) {
          console.error(
            "Erreur lors de la récupération des informations utilisateur:",
            err
          );
        }
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return isLoading ? (
    <div className="Load">
      <img src={Loading} alt="" />
    </div>
  ) : (
    <main>
      <div className="hero">
        <img src={hero} alt="Hero" />
      </div>
      <div className="home-container">
        <div className="home-page-title">
          <h1>
            <span className="left-bar">|</span>
            SOOK !<span className="right-bar">|</span>
          </h1>
        </div>

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
                  src={userInfo.account?.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              ) : (
                <div>
                  <img
                    src={logo} // Remplace par un chemin vers une image par défaut
                    alt="Avatar par défaut"
                    className="avatar"
                    style={{
                      filter: "blur(10%)",
                    }}
                  />
                </div>
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
        <div className="offer-home">
          {dataOffer.offers.map((offer) => (
            <Link to={`/offer/${offer._id}`}>
              <div key={offer._id} className="offer-item">
                <h2>{offer.title}</h2>
                <p>Prix : {offer.price}€</p>
                <p>Marque: {offer.brand}</p>
                <div className="userInfo">
                  {offer.userId?.account?.username ? (
                    <p>
                      {offer.userId.account?.username
                        ? offer.userId.account.username
                            .charAt(0)
                            .toUpperCase() +
                          offer.userId.account.username.slice(1)
                        : "Non spécifié"}
                    </p>
                  ) : (
                    <p>Utilisateur inconnu</p>
                  )}
                  {offer.userId?.account?.avatar && (
                    <img
                      src={offer.userId?.account.avatar}
                      alt="Avatar"
                      className="avatar"
                    />
                  )}
                </div>

                {offer.pictures && offer.pictures.length > 0 && (
                  <div className="pictures-offer">
                    {offer.pictures.map((picture, index) => (
                      <img
                        key={index}
                        src={picture}
                        alt={`Image de l'offre ${offer._id}`}
                        className="offer-image"
                      />
                    ))}
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
