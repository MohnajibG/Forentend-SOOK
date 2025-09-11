import axios from "axios";
import { IoMdClose } from "react-icons/io";

interface DeleteFromCartButtonProps {
  item: any;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  userId: string;
  token: string;
}

const DeleteFromCartButton: React.FC<DeleteFromCartButtonProps> = ({
  item,
  cart,
  setCart,
  token,
}) => {
  const handleDeleteFromCart = async () => {
    console.log("Item envoyé pour suppression :", item);

    try {
      await axios.delete(
        `https://site--sook--dnxhn8mdblq5.code.run/cart/${item.productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
    >
      <IoMdClose />
    </button>
  );
};

export default DeleteFromCartButton;
