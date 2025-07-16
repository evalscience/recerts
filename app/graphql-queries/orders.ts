import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import {
	type ApiError,
	fetchHypercertsGraphQL as fetchGraphQL,
} from "../utils/graphql";

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

type OrderByIdResponse = ResultOf<typeof ordersByIdQuery>;

export type OrderById = {
	hypercertId: string;
	invalidated: boolean;
};

export const fetchOrderById = async (orderId: string): Promise<OrderById> => {
	const [error, response] = await catchError<OrderByIdResponse, ApiError>(
		fetchGraphQL(ordersByIdQuery, {
			orderId,
		}),
	);
	if (error) {
		throw error;
	}

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
