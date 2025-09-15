import axios from "axios";
import { IoMdClose } from "react-icons/io";

interface DeleteFromCartButtonProps {
  item: {
    productId: string; // correspond à _id côté backend
    name: string;
    price: number;
    userId: string;
  };
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  token: string;
}

const DeleteFromCartButton: React.FC<DeleteFromCartButtonProps> = ({
  item,
  cart,
  setCart,
  token,
}) => {
  const handleDeleteFromCart = async () => {
    if (!item.productId) {
      console.error("Erreur : item.productId est undefined !");
      return;
    }

    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/cart/${item.productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Met à jour le state local du panier
      setCart(cart.filter((cartItem) => cartItem.productId !== item.productId));
    } catch (err: any) {
      console.error(
        "Erreur lors de la suppression :",
        err.response?.data || err.message
      );
    }
  };

  return (
    <button
      onClick={handleDeleteFromCart}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      aria-label={`Supprimer ${item.name} du panier`}
    >
      <IoMdClose />
    </button>
  );
};

export default DeleteFromCartButton;
