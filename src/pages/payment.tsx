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

// Charge la clé publique Stripe (pk_live ou pk_test)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Payement: React.FC = () => {
  const { cart } = useCart();
  const { token } = useUser();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirection si panier vide
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cart, navigate]);

  // Redirection si pas connecté
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Création du PaymentIntent côté backend
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const total = cart.reduce((sum, item) => sum + item.price, 0) * 100; // en centimes
        const { data } = await axios.post(
          "https://site--sook--dnxhn8mdblq5.code.run/create-payment-intent",
          { amount: Math.round(total) },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Erreur lors de la création du PaymentIntent:", err);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0 && token) {
      createPaymentIntent();
    }
  }, [cart, token]);

  if (loading || !clientSecret) {
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

        {/* Stripe Elements avec clientSecret */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
    </main>
  );
};

export default Payement;
