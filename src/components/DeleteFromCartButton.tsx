import React from "react";
import axios from "axios";
import { CartItem } from "../types/types";

interface DeleteFromCartButtonProps {
  item: CartItem;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  userId: string;
  token: string;
  className?: string;
}

const DeleteFromCartButton: React.FC<DeleteFromCartButtonProps> = ({
  item,
  cart,
  setCart,
  userId,
  token,
  className,
}) => {
  const handleDeleteFromCart = async () => {
    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/cart/${item.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart(cart.filter((cartItem) => cartItem.productId !== item.productId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      alert("Impossible de supprimer l'article du panier.");
    }
  };

  return (
    <button
      className={`px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors ${
        className || ""
      }`}
      onClick={handleDeleteFromCart}
    >
      X
    </button>
  );
};

export default DeleteFromCartButton;
