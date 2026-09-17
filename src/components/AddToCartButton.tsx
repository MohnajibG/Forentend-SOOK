import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsBagCheckFill, BsBagPlusFill } from "react-icons/bs";
import { CartItem } from "../types/types";
import { API_URL } from "../settings/api";

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
        `${API_URL}/cart/add`,
        { productId: item.productId },
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
      toast.error("Impossible d'ajouter cet article. Veuillez réessayer.");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`
        w-full flex items-center justify-center gap-2
        px-6 py-3 rounded-lg font-bold transition-colors
        ${
          isInCart
            ? "bg-white/20 text-white/70 cursor-not-allowed"
            : "bg-sook-accent text-white hover:bg-sook-accent-hover"
        }
      `}
    >
      {isInCart ? (
        <>
          <BsBagCheckFill size={18} /> Déjà dans votre panier
        </>
      ) : (
        <>
          <BsBagPlusFill size={18} /> Ajouter au panier
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
