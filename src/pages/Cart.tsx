import axios from "axios";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

import backgroundCart from "../assets/img/backgroundCart.webp";
import Loading from "../assets/img/Loading.gif";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

const Cart: React.FC = () => {
  const { cart, setCart } = useCart();
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/cart/userId"
        );
        setCart(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération du panier :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCart]);

  return (
    <main className="relative min-h-screen font-[Krub]">
      {/* Background plein écran */}
      <img
        src={backgroundCart}
        alt="background"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
      />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <img src={Loading} alt="Loading" className="w-20 h-20" />
        </div>
      ) : (
        <div className="relative z-10 mx-auto mt-24 mb-12 max-w-4xl bg-white/90 rounded-2xl p-8 shadow-xl space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800">Mon Panier</h1>

          {cart.length === 0 ? (
            <p className="text-gray-600">
              Votre panier est vide. Ajoutez des articles pour commencer !
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
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
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-300">
                <span className="text-xl font-semibold text-gray-800">
                  Total : {total} €
                </span>
              </div>

              <div className="mt-6">
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default Cart;
