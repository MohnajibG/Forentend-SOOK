import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";

import Loading from "../assets/img/Loading.gif";
import background from "../assets/img/backgroundCart.webp";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Payement: React.FC = () => {
  const { cart } = useCart();
  const { token } = useUser();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0 || !token) return;

    const totalAmount = Math.round(
      cart.reduce((sum, item) => sum + Number(item.price), 0) * 100
    );

    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          "https://site--sook--dnxhn8mdblq5.code.run/payment/create-payment-intent",
          { amount: totalAmount },
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
      <div className="relative min-h-24 flex items-center justify-center">
        <img
          src={background}
          alt="background"
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <img
          src={Loading}
          alt="Loading"
          className="w-20 h-20 animate-pulse rounded-full"
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
