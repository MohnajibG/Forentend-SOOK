import { useState } from "react";

import "../styles/cart.css";

import { CartItem } from "../../types/types";

import backgroundCart from "../img/backgroundCart.webp";

import RemoveFromCartButton from "../components/RemoveFromCartButton";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  return loading ? (
    <main className="cart-page">
      <img src={backgroundCart} alt="background" />
      <h2>Chargement .......</h2>
    </main>
  ) : (
    <main className="cart-page">
      <img src={backgroundCart} alt="background" />
      <h1>Mon Panier</h1>
      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.price} €</p>
                <p>Quantité : {item.quantity}</p>
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
            ))}
          </div>
        ) : (
          <div className="cart-items">
            <p>Votre panier est vide.</p>{" "}
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
