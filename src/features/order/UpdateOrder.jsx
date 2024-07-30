import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

// eslint-disable-next-line
function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  //  To update data without loading We need to wrap button in Form component
  // It will submit the form and revalidate data
  return (
    <fetcher.Form method="PATCH" className="text-right">
      {" "}
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

// eslint-disable-next-line
export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
