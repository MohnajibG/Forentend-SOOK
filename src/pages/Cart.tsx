import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

import backgroundCart from "../assets/img/backgroundCart.webp";
import Loading from "../assets/img/Loading.gif";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

import Payement from "./payment"; // notre composant de paiement

const Cart: React.FC = () => {
  const { cart, setCart } = useCart();
  const { userId, token } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/cart",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(data || []);
      } catch (err) {
        setError("Impossible de charger le panier. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCart, userId, token, navigate]);

  return (
    <main className="relative min-h-screen font-[Space Grotesk]">
      <img
        src={backgroundCart}
        alt="background"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
      />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <img
            src={Loading}
            alt="Loading"
            className="w-20 h-20 animate-pulse"
          />
        </div>
      ) : cart.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <p className="relative z-10 text-red-400 mt-24 text-center  font-bold">
            Votre panier est vide. Ajoutez des articles pour commencer !
          </p>
        </div>
      ) : (
        <div className="relative z-10 mx-auto mt-24 mb-12 max-w-4xl bg-white/90 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">Mon Panier</h1>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </p>
          )}

          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-4"
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-700">{item.price.toFixed(2)} €</p>
                </div>
                <DeleteFromCartButton
                  item={item}
                  cart={cart}
                  setCart={setCart}
                  token={token!}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-300">
            <span className="text-xl font-semibold text-gray-800">
              Total : {total} €
            </span>
          </div>

          {/* On utilise Payement ici */}
          <div className="mt-6">
            <Payement />
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
