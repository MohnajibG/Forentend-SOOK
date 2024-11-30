import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

const CheckoutForm = ({ title, price }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!elements) {
      // Meilleure vérification
      return;
    }

    try {
      const response = await axios.post(
        "https://lereacteur-vinted-api.herokuapp.com/v2/payment", // Ajout du `https://`
        {
          title,
          amount: price, // Utilisation de la syntaxe plus concise
        }
      );

      const clientSecret = response.data.client_secret;

      const stripeResponse = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:5173/",
        },
        redirect: "if_required",
      });

      if (stripeResponse.error) {
        setErrorMessage(stripeResponse.error.message);
      } else if (stripeResponse.paymentIntent.status === "succeeded") {
        setCompleted(true);
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la transaction : " + error.message);
    }

    setIsLoading(false);
  };

  return completed ? (
    <p>Paiement effectué</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements || isLoading}>
        Pay
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
