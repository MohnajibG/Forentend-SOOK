import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import "../assets/styles/style.css";
import { CartItem } from "../types/types";

interface AddToCartButtonProps {
  item: { id: string; name: string; price: number };
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  token: string;
  userId: string;
  onSuccess?: () => void; // Ajout de la prop facultative
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
    const foundItemInCart = cart.find((cartItem) => cartItem.id === item.id);
    setIsInCart(!!foundItemInCart);
  }, [cart, item.id]);

  const handleAddToCart = async () => {
    if (isInCart) {
      console.log("Cet article est déjà dans le panier.");
      return;
    }

    try {
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/cart/add",
        {
          userId,
          id: item.id,
          name: item.name,
          price: item.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Produit ajouté au panier:", response.data);
        setCart(response.data.cart);
        setIsInCart(true);

        // ✅ Appel de la fonction onSuccess pour afficher un toast
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error(
          "Problème avec l'ajout au panier:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={isInCart ? "button-in-cart" : "button-add-to-cart"}
    >
      {isInCart ? "Déjà dans votre panier" : "Ajouter au panier"}
    </button>
  );
};

export default AddToCartButton;
