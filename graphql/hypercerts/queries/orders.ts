import { fetchHypercertsGraphQL as fetchGraphQL, graphql } from "../";
import { tryCatch } from "@/lib/tryCatch";

const ordersByIdQuery = graphql(`
  query GetOrderById($orderId: String!) {
    orders(where: { order_id: { eq: $orderId } }) {
      data {
        hypercert_id
        invalidated
      }
    }
  }
`);

export type OrderById = {
  hypercertId: string;
  invalidated: boolean;
};

export const fetchOrderById = async (orderId: string): Promise<OrderById> => {
  const [response, error] = await tryCatch(() =>
    fetchGraphQL(ordersByIdQuery, {
      orderId,
    })
  );
  if (error) throw error;

  const order = response.orders.data?.[0];
  if (!order)
    throw {
      message: "Order not found",
      type: "PAYLOAD",
    };

  const fractionData = {
    hypercertId: order.hypercert_id,
    invalidated: order.invalidated,
  } satisfies OrderById;

  return fractionData;
};
