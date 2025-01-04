import { CartItem } from "../../types/types";
interface AddToCartButtonProps {
  item: { id: string; name: string; price: number };
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  cart,
  setCart,
}) => {
  const handleAddToCart = (item: CartItem) => {
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
    setCart(addCartCopy);
  };

  return (
    <button onClick={() => handleAddToCart({ ...item, quantity: 1 })}>
      Ajouter au panier
    </button>
  );
};

export default AddToCartButton;
