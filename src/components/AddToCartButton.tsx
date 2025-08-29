import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartItem } from "../types/types";

interface AddToCartButtonProps {
  item: { productId: string; name: string; price: number };
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  token: string;
  userId: string;
  onSuccess?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  cart,
  setCart,
  token,
  userId,
  onSuccess,
}) => {
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    setIsInCart(!!cart.find((ci) => ci.productId === item.productId));
  }, [cart, item.productId]);

  const handleAddToCart = async () => {
    if (isInCart) return;

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/cart/add",
        { productId: item.productId }, // ✅ seulement productId
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setCart(response.data.cart);
        setIsInCart(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`
        px-5 py-2 text-[12px] rounded-[5px] font-semibold transition-colors
        ${
          isInCart
            ? "bg-[#ccc] text-[#666] cursor-not-allowed hover:bg-[#ccc]"
            : "bg-[#4caf50] text-white hover:bg-[#45a049]"
        }
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      {isInCart ? "Déjà dans votre panier" : "Ajouter au panier"}
    </button>
  );
};

export default AddToCartButton;
