import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";

import "../assets/styles/cart.css";
import "../assets/styles/button.css";

import backgroundCart from "../assets/img/backgroundCart.webp";

import RemoveFromCartButton from "../components/updateCartButton";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

import Loading from "../assets/img/Loading.gif";

const Cart: React.FC = () => {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

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
      {loading ? (
        <img src={Loading} alt="Loading" />
      ) : (
        <div className="cart-container">
          <h1>Mon Panier</h1>
          {cart.length === 0 ? (
            <p>Votre panier est vide. Ajoutez des articles pour commencer !</p>
          ) : (
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <h3>{item.name}</h3>
                  <p>{item.price.toFixed(2)} €</p>
                  <div className="cart-actions">
                    <DeleteFromCartButton
                      item={item}
                      cart={cart}
                      setCart={setCart}
                    />
                  </div>
                </div>
              ))}
              {cart.length > 0 && <h2 className="total">Total : {total} €</h2>}
            </div>
          )}
          {cart.length > 0 && <button>Payer</button>}
        </div>
      )}
    </main>
  );
};

export default Cart;
