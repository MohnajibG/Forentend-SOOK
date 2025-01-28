import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartItem } from "../types/types";

interface AddToCartButtonProps {
  item: { id: string; name: string; price: number };
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  token: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  token,
  item,
  cart,
  setCart,
}) => {
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
  }
  const handleAddToCart = async () => {
    const addCartCopy = [...cart];
    const foundItem = addCartCopy.find((cartItem) => cartItem.id === item.id);

    // Si l'article n'est pas dans le panier, on l'ajoute
    if (!foundItem) {
      addCartCopy.push({
        ...item,
        quantity: 0,
      });
    } else {
      console.log("Cet article est déjà dans le panier.");
    }

    try {
      // Envoi des données au backend
      const response = await axios.post(
        "https://site--sook--dnxhn8mdblq5.code.run/cart/add",
        {
          id: item.id, // Assurez-vous que ces champs sont bien attendus côté backend
          name: item.name,
          price: item.price,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Vérification de la réponse du serveur
      if (response.status === 200 || response.status === 201) {
        console.log("Produit ajouté au panier:", response.data);
        // Mise à jour du panier local
        setCart(addCartCopy);
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

  return <button onClick={handleAddToCart}>Ajouter au panier</button>;
};

export default AddToCartButton;
