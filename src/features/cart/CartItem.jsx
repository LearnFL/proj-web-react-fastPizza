import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { GetCurrentQuantityById } from "./cartSlice";

// eslint-disable-next-line
function CartItem({ item }) {
  // eslint-disable-next-line
  const { pizzaId, name, quantity, totalPrice } = item;
  const currentQuantity = useSelector(GetCurrentQuantityById(pizzaId));

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity
          currentQuantity={currentQuantity}
          pizzaId={pizzaId}
        />
        <DeleteItem id={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
