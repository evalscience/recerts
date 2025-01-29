import { typeCastApiResponseToBigInt } from "@/lib/utils";
import { graphql } from "gql.tada";
import { catchError } from "../utils";
import { fetchHypercertsGraphQL as fetchGraphQL } from "../utils/graphql";

const getSalesByUserQuery = graphql(`
  query SalesByUser($user_id: String!) {
    sales(where: { buyer: { eq: $user_id } }) {
      data {
        currency
        currency_amount
        amounts
        creation_block_timestamp
        transaction_hash
        id
        hypercert {
          hypercert_id
          metadata {
            work_scope
            image
            description
            name
          }
        }
      }
    }
  }
`);

export type SaleByUserHypercert = {
	hypercertId: string;
	metadata: {
		workScope?: string[];
		image?: string;
		description?: string;
		name?: string;
	};
};

export type SaleByUser = {
	currency: string;
	currencyAmount: bigint;
	unitsBought: bigint;
	creationBlockTimestamp: number;
	transactionHash: string;
	id: string;
	hypercert: SaleByUserHypercert;
};

export const fetchSalesByUser = async (userAddress: `0x${string}`) => {
	const [error, response] = await catchError(
		fetchGraphQL(getSalesByUserQuery, {
			user_id: userAddress,
		}),
	);
	if (error) throw error;

	const sales = response.sales.data ?? [];
	const salesByUser = sales.map((sale) => {
		const hypercert = sale.hypercert;
		if (!hypercert || !hypercert.hypercert_id) return null;

		const { work_scope, image, description, name } = hypercert.metadata ?? {};

		return {
			currency: sale.currency,
			currencyAmount: typeCastApiResponseToBigInt(sale.currency_amount) ?? 0n,
			unitsBought: typeCastApiResponseToBigInt(sale.amounts) ?? 0n,
			creationBlockTimestamp: Number(sale.creation_block_timestamp),
			transactionHash: sale.transaction_hash,
			id: sale.id,
			hypercert: {
				hypercertId: hypercert.hypercert_id,
				metadata: {
					workScope: work_scope ?? undefined,
					image: image ?? undefined,
					description: description ?? undefined,
					name: name ?? undefined,
				},
			},
		} satisfies SaleByUser;
	});

	return salesByUser.filter((sale) => sale !== null);
};

const getSalesByHypercertQuery = graphql(`
  query SalesByHypercert($hypercert_id: String!) {
    sales(where: { hypercert_id: { eq: $hypercert_id } }) {
      data {
        currency
        currency_amount
        amounts
        creation_block_timestamp
        transaction_hash
        id
        buyer
      }
    }
  }
`);

export type SaleByHypercert = {
	currency: string;
	currencyAmount: bigint;
	unitsBought: bigint;
	creationBlockTimestamp: number;
	transactionHash: string;
	id: string;
	buyer: string;
};

export const fetchSalesByHypercert = async (hypercertId: string) => {
	const [error, response] = await catchError(
		fetchGraphQL(getSalesByHypercertQuery, {
			hypercert_id: hypercertId,
		}),
	);
	if (error) throw error;

	const sales = response.sales.data ?? [];
	const SalesByHypercert = sales.map((sale) => {
		return {
			currency: sale.currency,
			currencyAmount: typeCastApiResponseToBigInt(sale.currency_amount) ?? 0n,
			unitsBought: typeCastApiResponseToBigInt(sale.amounts) ?? 0n,
			creationBlockTimestamp: Number(sale.creation_block_timestamp),
			transactionHash: sale.transaction_hash,
			id: sale.id,
			buyer: sale.buyer,
		} satisfies SaleByHypercert;
	});

	return SalesByHypercert.filter((sale) => sale !== null);
};
