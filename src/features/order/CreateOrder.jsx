// eslint-disable-next-line no-unused-vars
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
// eslint-disable-next-line no-unused-vars
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const {
    // eslint-disable-next-line
    error: errorAddress,
    username,
    status: addressStatus,
    address,
    position,
  } = useSelector((store) => store.user);

  const isLoadingAddress = addressStatus === "loading";

  const dispatch = useDispatch();
  const formErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            defaultValue={username}
            className="input grow"
            type="text"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.errors.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            {/* INPUT class is comong from index.css tailwing APPLY function`` */}
            <input
              className="input w-full"
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute z-50 sm:bottom-[3px] sm:right-[3px] md:right-[5px] md:top-[5px]">
              {/* NOTE Use preventDefault() since this button is inside of a Form */}
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Postion
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* NOTE Hidden input is just for testing, it adds Fake Cart to action. Action has no way of getting that data otherwise */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Placing order..."
              : `Order now ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// NOTE REACT gives us access to request from form
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Override order
  const order = {
    ...data,
    // NOTE Converting cart back to array of objects
    cart: JSON.parse(data.cart),
    priority: data.priority,
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Invalid phone number";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // eslint-disabled-next-line
  const newOrder = await createOrder(order);
  store.dispatch(clearCart()); // Clearing cart after successful order creation

  // NOTE Provided by React Router. Canno use useNavigate as it is a hook and will not work in this fucntion
  return redirect("/order/" + newOrder.id, 303);
  // return null;
}

export default CreateOrder;
