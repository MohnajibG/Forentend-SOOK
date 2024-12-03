import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, Navigate } from "react-router-dom";
import CheckoutForm from "../assets/components/CheckoutForm";
import { useUser } from "../contexts/UserContext"; // Assure-toi que tu utilises le context pour récupérer le token

const stripePromise = loadStripe(
  "pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP"
);

const Payment = () => {
  const location = useLocation();
  const { title, price } = location.state || {}; // Sécuriser l'accès à title et price
  const { token } = useUser(); // Récupérer le token de l'utilisateur depuis le contexte

  if (!title || !price) {
    return <Navigate to="/home" />; // Si title ou price est manquant, rediriger
  }

  // Configurer les options Stripe
  const options = {
    clientSecret: "your_client_secret_here", // Génère un clientSecret côté serveur
    appearance: {
      theme: "stripe" as "stripe", // Utilise le type "stripe" pour theme
    },
  };

  return token ? (
    <div>
      <h3 className="payment">
        {title} - Montant à régler : {price}€
      </h3>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm title={title} price={price} />
      </Elements>
    </div>
  ) : (
    <Navigate to={"/login"} />
  );
};

export default Payment;
