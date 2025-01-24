import React from "react";
import axios from "axios";
import { CartItem } from "../types/types";

interface UpdateCartButtonProps {
  item: CartItem;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const UpdateCartButton: React.FC<UpdateCartButtonProps> = ({
  item,
  cart,
  setCart,
}) => {
  const handleUpdateCart = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      console.error("La quantité doit être supérieure à zéro.");
      return;
    }

    try {
      // Effectuer la requête PUT pour mettre à jour la quantité côté backend
      const response = await axios.put<{ updatedItem: CartItem }>(
        `https://site--sook--dnxhn8mdblq5.code.run/carts/${item.id}`,
        { quantity: newQuantity }
      );

      // Mettre à jour le panier dans l'état local après une réponse réussie
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: response.data.updatedItem.quantity }
          : cartItem
      );

      setCart(updatedCart);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  return (
    <div>
      <button onClick={() => handleUpdateCart(item.quantity + 1)}>
        Augmenter
      </button>
      <button onClick={() => handleUpdateCart(item.quantity - 1)}>
        Diminuer
      </button>
    </div>
  );
};

export default UpdateCartButton;
