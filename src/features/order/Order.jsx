// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
// eslint-disable-next-line
import { getOrder, updateOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  // order id for API testing CQE92U, IIDSAT
  const order = useLoaderData();
  const fetcher = useFetcher();

  // Fetch at component mount
  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") fetcher.load(`/menu`);
  }, [fetcher]);

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    // eslint-disable-next-line no-unused-vars
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    // eslint-disable-next-line no-unused-vars
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-sm text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem
            isLoadingIngredients={fetcher.state === "loading"}
            ingredients={
              // if data doe snot exist YET return empty array
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
            item={item}
            key={item.pizzaId}
          />
        ))}{" "}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

// NOTE REACT ROUTER GIVES US ACCESA TO PARAMS
// NOTE CANNOT USE useParams AS IT WORKS INSIDE COMPNENTS ONLY SINCE IT IS A HOOK
// eslint-disable-next-line
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
