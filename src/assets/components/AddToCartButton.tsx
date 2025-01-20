import axios from "axios";
import { CartItem } from "../../types/types";

interface AddToCartButtonProps {
  item: { id: string; name: string; price: number; quantity: number };
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  cart,
  setCart,
}) => {
  const handleAddToCart = async (item: CartItem) => {
    const addCartCopy = [...cart];
    const foundItem = addCartCopy.find((cartItem) => cartItem.id === item.id);

    if (!foundItem) {
      addCartCopy.push({
        ...item,
        quantity: 1,
      });
    } else {
      foundItem.quantity++;
    }

    try {
      // Envoi des données mises à jour au backend
      await axios.post("https://site--sook--dnxhn8mdblq5.code.run/cart/add", {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: foundItem ? foundItem.quantity : 1,
      });

      // Met à jour le panier côté frontend
      setCart(addCartCopy);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article au panier :", error);
    }
  };

  return (
    <button onClick={() => handleAddToCart({ ...item, quantity: 1 })}>
      Ajouter au panier
    </button>
  );
};

export default AddToCartButton;
