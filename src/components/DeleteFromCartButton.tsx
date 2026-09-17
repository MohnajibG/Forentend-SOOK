import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { API_URL } from "../settings/api";

interface DeleteFromCartButtonProps {
  item: {
    productId: string;
    name: string;
    price: number;
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
        `${API_URL}/cart/${item.productId}`,
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
      className="shrink-0 w-9 h-9 grid place-items-center rounded-full text-white/70 hover:bg-[#ff4d4d] hover:text-white transition-colors"
      aria-label={`Supprimer ${item.name} du panier`}
    >
      <IoMdClose size={18} />
    </button>
  );
};

export default DeleteFromCartButton;
