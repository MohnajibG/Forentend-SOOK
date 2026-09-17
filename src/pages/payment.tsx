import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";

import Loading from "../assets/img/Loading.gif";
import { API_URL } from "../settings/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Payement: React.FC = () => {
  const { cart } = useCart();
  const { token } = useUser();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0 || !token) return;

    // Le montant est calculé et vérifié côté serveur à partir du panier
    // de l'utilisateur authentifié : on ne l'envoie plus depuis le client.
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${API_URL}/payment/create-payment-intent`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Erreur lors de la création du PaymentIntent:", err);
      }
    };

    createPaymentIntent();
  }, [cart, token]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-6">
        <img
          src={Loading}
          alt="Chargement du paiement..."
          className="w-14 h-14 animate-pulse rounded-full"
        />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payement;
