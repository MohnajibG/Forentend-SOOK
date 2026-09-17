import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BsBagFill } from "react-icons/bs";

import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { API_URL } from "../settings/api";

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

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <main className="relative min-h-screen">
      <img
        src={backgroundCart}
        alt="background"
        className="fixed inset-0 -z-10 w-full h-full object-cover"
      />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <img src={Loading} alt="Loading" className="w-20 h-20 animate-pulse" />
        </div>
      ) : cart.length === 0 ? (
        <div className="flex items-center justify-center h-screen px-4">
          <div className="glass-rose text-center px-8 py-12 max-w-sm flex flex-col items-center gap-4">
            <BsBagFill className="text-[#dfa080]" size={36} />
            <div>
              <h1 className="text-xl font-bold mb-1">Votre panier est vide</h1>
              <p className="text-sm text-white/75">
                Parcourez les offres du moment et ajoutez ce qui vous plaît —
                il n'y a pas de petite trouvaille.
              </p>
            </div>
            <Link to="/offers" className="btn-primary">
              Découvrir les offres
            </Link>
          </div>
        </div>
      ) : (
        <div className="page-shell relative z-10 mx-auto max-w-5xl px-4">
          <h1 className="text-3xl font-semibold mb-6">
            Mon panier <span className="text-white/60 text-xl">({itemCount})</span>
          </h1>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md mb-4">
              {error}
            </p>
          )}

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Articles */}
            <div className="glass-rose p-6 space-y-3">
              {cart.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex items-center gap-4 bg-white/15 rounded-lg p-4"
                >
                  <span className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <BsBagFill className="text-white/70" size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold truncate">{item.name}</h2>
                    <p className="text-white/75 text-sm">
                      {item.quantity > 1 ? `${item.quantity} × ` : ""}
                      {item.price.toFixed(2)} €
                    </p>
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

            {/* Résumé + paiement */}
            <div className="glass-gold p-6 flex flex-col gap-4 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Résumé de la commande</h2>
              <div className="flex justify-between text-sm text-white/85">
                <span>Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})</span>
                <span>{total} €</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/30">
                <span>Total</span>
                <span>{total} €</span>
              </div>

              <Payement />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
