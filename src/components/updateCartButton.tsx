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
      const response = await axios.put<{ updatedItem: CartItem }>(
        `https://site--sook--dnxhn8mdblq5.code.run/carts/${item.productId}`,
        { quantity: newQuantity }
      );

      const updatedCart = cart.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: response.data.updatedItem.quantity }
          : cartItem
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleUpdateCart(item.quantity - 1)}
        disabled={item.quantity <= 1}
        className="
          px-3 py-1 rounded-md font-bold text-white
          bg-[#dfa080bd] hover:bg-[#c87660]
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors
        "
        aria-label="Diminuer la quantité"
      >
        –
      </button>

      <span className="min-w-[2rem] text-center font-medium text-gray-800">
        {item.quantity}
      </span>

      <button
        onClick={() => handleUpdateCart(item.quantity + 1)}
        className="
          px-3 py-1 rounded-md font-bold text-white
          bg-[#dfa080bd] hover:bg-[#c87660]
          transition-colors
        "
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
};

export default UpdateCartButton;
