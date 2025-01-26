import { collectionId } from "@/config/hypercert";
import {
	calculateBigIntPercentage,
	typeCastApiResponseToBigInt,
} from "@/lib/utils";
import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import { fetchHypercertsGraphQL as fetchGraphQL } from "../utils/graphql";
import { fetchFullHypercertById } from "./hypercerts";

const getHypercertsSalesMetadataQuery = graphql(`
  query GetSalesMetadata($collection_id: String!) {
    sales(where: { collection: { eq: $collection_id } }) {
      count
      data {
        buyer
        hypercert_id
      }
    }
  }
`);

type HypercertsSalesMetadataQueryResponse = ResultOf<
	typeof getHypercertsSalesMetadataQuery
>;

type HypercertsSalesMetadata = {
	count?: number;
	buyers: Set<string>;
	hypercertIds: Set<string>;
};

const fetchHypercertsSalesMetadata =
	async (): Promise<HypercertsSalesMetadata> => {
		const [error, response] = await catchError(
			fetchGraphQL(getHypercertsSalesMetadataQuery, {
				collection_id: collectionId,
			}),
		);
		if (error) throw error;

		const buyers = new Set<string>();
		const hypercertIds = new Set<string>();

		for (const sale of response.sales?.data ?? []) {
			buyers.add(sale.buyer);
			if (sale.hypercert_id) {
				hypercertIds.add(sale.hypercert_id);
			}
		}

		const HypercertsSalesMetadata = {
			count: response.sales.count ?? undefined,
			buyers,
			hypercertIds,
		};
		return HypercertsSalesMetadata;
	};

const getSalesByHypercertIdQuery = graphql(`
  query GetSalesByHypercertId($hypercert_id: String!) {
    hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
      data {
        fractions {
          data {
            units
          }
        }
        orders {
          totalUnitsForSale
          cheapestOrder {
            pricePerPercentInUSD
          }
        }
      }
    }
  }
`);

const fetchSalesInUSDByHypercertId = async (hypercertId: string) => {
	const [error, response] = await catchError(
		fetchGraphQL(getSalesByHypercertIdQuery, {
			hypercert_id: hypercertId,
		}),
	);
	if (error) throw error;

	const hypercert = response.hypercerts.data
		? response.hypercerts.data[0]
		: null;
	if (!hypercert)
		throw {
			message: "Hypercert not found",
			type: "PAYLOAD",
		};

	const unitsInEveryFraction =
		hypercert.fractions?.data?.map((fraction) => {
			return typeCastApiResponseToBigInt(fraction.units) ?? 0n;
		}) ?? [];
	const totalUnitsForSale =
		typeCastApiResponseToBigInt(hypercert.orders?.totalUnitsForSale) ?? 0n;
	const pricePerPercentInUSD = Number(
		hypercert.orders?.cheapestOrder?.pricePerPercentInUSD ?? 0,
	);

	const totalHypercertUnits = unitsInEveryFraction.reduce(
		(totalUnitsSold, units) => totalUnitsSold + units,
		0n,
	);
	const unitsSold = totalHypercertUnits - totalUnitsForSale;
	const percentageOfUnitsSold = calculateBigIntPercentage(
		unitsSold,
		totalHypercertUnits,
	);
	return pricePerPercentInUSD * (percentageOfUnitsSold ?? 0);
};

export const fetchTotalHypercertsSalesData = async (): Promise<
	HypercertsSalesMetadata & { totalSalesInUSDPromise: Promise<number[]> }
> => {
	const [error, hypercertSalesMetadata] = await catchError(
		fetchHypercertsSalesMetadata(),
	);
	if (error) throw error;

	const hypercertIdsSet = hypercertSalesMetadata.hypercertIds;
	const hypercertIds = [...hypercertIdsSet];
	const salesByHypercertIdPromises = hypercertIds.map((hypercertId) => {
		return new Promise<number>((resolve) => {
			fetchSalesInUSDByHypercertId(hypercertId)
				.then((salesInUSD) => resolve(salesInUSD))
				.catch(() => resolve(0));
		});
	});

	const totalSalesInUSDPromise = Promise.all(salesByHypercertIdPromises);

	return { ...hypercertSalesMetadata, totalSalesInUSDPromise };
};
