// src/pages/Payement.tsx
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

import CheckoutForm from "../components/CheckoutForm";
import Loading from "../assets/img/Loading.gif";
import background from "../assets/img/backgroundCart.webp";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Payement: React.FC = () => {
  const { cart } = useCart();
  const { token } = useUser();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // Si panier vide, redirige vers /cart
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    } else {
      setReady(true);
    }
  }, [cart, navigate]);

  // Empêche l'accès si non connecté
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!ready) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={background}
          alt="background"
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
        <img src={Loading} alt="Loading" className="w-20 h-20" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen font-[Krub]">
      {/* Fond */}
      <img
        src={background}
        alt="background"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
      />

      <div className="relative z-10 mx-auto mt-24 mb-12 max-w-lg bg-white/90 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Paiement Sécurisé
        </h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </main>
  );
};

export default Payement;
