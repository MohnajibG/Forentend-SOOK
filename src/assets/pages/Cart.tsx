import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";

import "../styles/cart.css";
import backgroundCart from "../img/backgroundCart.webp";

import RemoveFromCartButton from "../components/updateCartButton";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

import Loading from "../img/Loading.gif";

const Cart: React.FC = () => {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--sook--dnxhn8mdblq5.code.run/cart"
        );
        console.log("cart==>", response);

        setCart(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
      setLoading(false);
    };

    fetchCart();
  }, [setCart]);
  return (
    <main className="cart-page">
      <img src={backgroundCart} alt="background" className="background-img" />
      <h1>Mon Panier</h1>
      {loading ? (
        <img src={Loading} alt="Loading" />
      ) : (
        <div className="cart-container">
          {cart.length === 0 ? (
            <p>Votre panier est vide. Ajoutez des articles pour commencer !</p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <h3>{item.name}</h3>
                  <p>{item.price.toFixed(2)} €</p>
                  <p>Quantité : {item.quantity}</p>
                  <div className="cart-actions">
                    <RemoveFromCartButton
                      item={item}
                      cart={cart}
                      setCart={setCart}
                    />
                    <DeleteFromCartButton
                      item={item}
                      cart={cart}
                      setCart={setCart}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && <button>Payer</button>}
        </div>
      )}
    </main>
  );
};

export default Cart;
