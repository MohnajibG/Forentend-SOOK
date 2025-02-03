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
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  cart,
  setCart,
  userId,
}) => {
  const [isInCart, setIsInCart] = useState(false); // Utilisation de useState pour gérer isInCart
  const navigate = useNavigate();
  const token = Cookies.get("token"); // Récupère le token depuis le cookie

  // Vérification du token dans un useEffect pour éviter de bloquer le rendu
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirige l'utilisateur vers la page de login s'il n'y a pas de token
    }
  }, [token, navigate]);

  // Vérification si l'article est déjà dans le panier
  useEffect(() => {
    const foundItemInCart = cart.find((cartItem) => cartItem.id === item.id);
    if (foundItemInCart) {
      setIsInCart(true); // L'article est déjà dans le panier
    } else {
      setIsInCart(false); // L'article n'est pas dans le panier
    }
  }, [cart, item.id]); // Re-vérifie si l'article est dans le panier à chaque mise à jour du panier

  const handleAddToCart = async () => {
    const addCartCopy = [...cart];
    const foundItem = addCartCopy.find((cartItem) => cartItem.id === item.id);

    // Si l'article est déjà dans le panier, on ne l'ajoute pas
    if (foundItem) {
      console.log("Cet article est déjà dans le panier.");

      return;
    } else {
      // Si l'article n'est pas dans le panier, on l'ajoute
      addCartCopy.push({
        ...item,
        quantity: 1, // On commence avec une quantité de 1
      });
    }

    try {
      // Envoi des données au backend
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/cart/add",
        {
          userId, // Ajout de l'ID de l'utilisateur pour lier le panier
          id: item.id,
          name: item.name,
          price: item.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ajout du token dans les headers
          },
        }
      );

      // Vérification de la réponse du serveur
      if (response.status === 200 || response.status === 201) {
        console.log("Produit ajouté au panier:", response.data);
        // Mise à jour du panier local avec les données du backend
        setCart(response.data.cart);
        setIsInCart(true); // L'article est maintenant dans le panier
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
      className={isInCart ? "button-in-cart" : "button-add-to-cart"} // Classe conditionnelle
    >
      {isInCart ? "Déjà dans votre panier" : "Ajouter au panier"}
    </button>
  );
};

export default AddToCartButton;
