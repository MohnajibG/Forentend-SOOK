import { CartItem } from "../../types/types";

interface RemoveFromCartButtonProps {
  item: CartItem;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const RemoveFromCartButton: React.FC<RemoveFromCartButtonProps> = ({
  item,
  cart,
  setCart,
}) => {
  const handleRemoveFromCart = () => {
    let removeCartCopy = [...cart];
    const foundItem = removeCartCopy.find(
      (cartItem) => cartItem.id === item.id
    );
    if (foundItem && foundItem.quantity === 1) {
      removeCartCopy = removeCartCopy.filter(
        (cartItem) => cartItem.id !== item.id
      );
    } else if (foundItem) {
      foundItem.quantity--;
    }
    setCart(removeCartCopy);
  };

  return <button onClick={handleRemoveFromCart}>Retirer</button>;
};

export default RemoveFromCartButton;
