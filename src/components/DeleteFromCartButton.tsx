import React from "react";
import axios from "axios";
import { CartItem } from "../types/types";

import "../assets/styles/style.css";

interface DeleteFromCartButtonProps {
  item: CartItem;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const DeleteFromCartButton: React.FC<DeleteFromCartButtonProps> = ({
  item,
  cart,
  setCart,
}) => {
  const handleDeleteFromCart = async () => {
    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/cart/${item.id}`
      );

      setCart(cart.filter((cartItem) => cartItem.id !== item.id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
    }
  };

  return (
    <button className="delete" onClick={handleDeleteFromCart}>
      X
    </button>
  );
};

export default DeleteFromCartButton;
