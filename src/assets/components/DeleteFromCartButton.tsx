import React from "react";
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
  const handleDeleteFromCart = () => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  return <button onClick={handleDeleteFromCart}>Supprimer</button>;
};

export default DeleteFromCartButton;
