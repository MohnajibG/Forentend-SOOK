import React from "react";
import axios from "axios";
import { CartItem } from "../../types/types";

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
      // Suppression de l'article côté backend
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/carts/${item.id}`
      );

      // Mise à jour du panier localement
      const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
      setCart(updatedCart);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'article du panier :",
        error
      );
    }
  };

  return <button onClick={handleDeleteFromCart}>Supprimer</button>;
};

export default DeleteFromCartButton;
