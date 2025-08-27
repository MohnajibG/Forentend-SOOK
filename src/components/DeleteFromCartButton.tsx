import React from "react";
import axios from "axios";
import { CartItem } from "../types/types";

interface DeleteFromCartButtonProps {
  item: CartItem;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  className?: string;
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
    <button
      className="bg-red-700 w-auto h-auto rounded-lg text-black"
      onClick={handleDeleteFromCart}
    >
      X
    </button>
  );
};

export default DeleteFromCartButton;
