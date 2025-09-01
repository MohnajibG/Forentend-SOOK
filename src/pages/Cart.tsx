// src/pages/Payement.tsx
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import CheckoutForm from "../components/CheckoutForm";

import Loading from "../assets/img/Loading.gif";
import background from "../assets/img/backgroundCart.webp";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Payement: React.FC = () => {
  const { cart } = useCart();
  const { token } = useUser();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    console.log("Cart contents:", cart);

    // Montant total en centimes
    const totalAmount = Math.round(
      cart.reduce((sum, item) => sum + item.price, 0) * 100
    );

    // Appel backend -> création PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          "https://site--sook--dnxhn8mdblq5.code.run/payment/create-payment-intent",
          { amount: totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Client Secret reçu:", data.clientSecret);

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Erreur lors de la création du PaymentIntent:", err);
      }
    };

    createPaymentIntent();
  }, [cart, token, navigate]);

  if (!clientSecret) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={background}
          alt="background"
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <img src={Loading} alt="Loading" className="w-20 h-20 animate-pulse" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen font-[Krub]">
      <img
        src={background}
        alt="background"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
      />

      <div className="relative z-10 mx-auto mt-24 mb-12 max-w-lg bg-white/90 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Paiement Sécurisé
        </h1>

        {/* ✅ On passe stripe + clientSecret */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
    </main>
  );
};

export default Payement;
