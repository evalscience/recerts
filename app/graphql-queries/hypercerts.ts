import { hyperboardId } from "@/config/hypercerts";
import { typeCastApiResponseToBigInt } from "@/lib/utils";
import type { ApiError } from "@/types/api";
import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import { fetchHypercertsGraphQL as fetchGraphQL } from "../utils/graphql";
import { hypercert } from "./templates";

interface CachedOrder {
	id: string;
	price: string | number;
	pricePerPercentInToken: string | number;
	pricePerPercentInUSD: string | number;
	currency: string;
	chainId: string;
}

interface CachedSale {
	unitsBought: string | number;
	buyer: string;
	currency: string;
	currencyAmount: string | number;
	creationBlockTimestamp: string | number;
	transactionHash: string;
}

interface CachedAttestation {
	attester: string;
	creationBlockTimestamp: string | number;
	data: string;
	id: string;
}

const hypercertIdsByHyperboardIdQuery = graphql(`
  query GetHypercertIdsByHyperboardId($hyperboard_id: UUID!) {
    hyperboards(where: { id: { eq: $hyperboard_id } }) {
      data {
        sections {
          data {
            entries {
              id
            }
          }
        }
      }
    }
  }
`);
type HypercertIdsByHyperboardIdResponse = ResultOf<
	typeof hypercertIdsByHyperboardIdQuery
>;

export const fetchHypercertIDs = async () => {
	const [error, response] = await catchError<
		HypercertIdsByHyperboardIdResponse,
		ApiError
	>(
		fetchGraphQL(hypercertIdsByHyperboardIdQuery, {
			hyperboard_id: hyperboardId,
		}),
	);
	if (error) {
		throw error;
	}
	const hyperboards = response.hyperboards.data;
	if (!hyperboards)
		throw {
			message: "Hyperboard not found",
			type: "PAYLOAD",
		};
	const ids: string[] = [];
	for (const hyperboard of hyperboards) {
		for (const section of hyperboard.sections.data) {
			for (const entry of section.entries) {
				ids.push(entry.id);
			}
		}
	}

	return ids;
};

const hypercertByHypercertIdQuery = graphql(`
  query GetHypercertsByHypercertId($hypercert_id: String!) {
    hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
      ${hypercert}
    }
  }
`);
type HypercertByHypercertIdQueryResponse = ResultOf<
	typeof hypercertByHypercertIdQuery
>;

export type Hypercert = {
	hypercertId: string;
	chainId?: string;
	name?: string;
	description?: string;
	image?: string;
	totalUnits: bigint;
	unitsForSale?: bigint;
	pricePerPercentInUSD?: number;
	buyerCount: number;
};

const fetchHypercertById = async (hypercertId: string): Promise<Hypercert> => {
	const [error, response] = await catchError<
		HypercertByHypercertIdQueryResponse,
		ApiError
	>(
		fetchGraphQL(hypercertByHypercertIdQuery, {
			hypercert_id: hypercertId,
		}),
	);
	if (error) {
		throw error;
	}

	const hypercert = response.hypercerts.data
		? response.hypercerts.data[0]
		: null;
	if (!hypercert)
		throw {
			message: "Hypercert not found",
			type: "PAYLOAD",
		};

	const pricePerPercentInUSD =
		hypercert.orders?.cheapestOrder?.pricePerPercentInUSD;
	const pricePerPercentInUSDNumber = pricePerPercentInUSD
		? Number(pricePerPercentInUSD)
		: undefined;

	// Get unique buyers count
	const uniqueBuyers = new Set(
		hypercert.sales?.data?.map((sale) => sale.buyer as string) ?? [],
	);

	return {
		hypercertId,
		chainId: (hypercert.contract?.chain_id as string) ?? undefined,
		name: hypercert.metadata?.name ?? undefined,
		description: hypercert.metadata?.description ?? undefined,
		image: hypercert.metadata?.image ?? undefined,
		totalUnits: typeCastApiResponseToBigInt(hypercert.units) ?? 0n,
		unitsForSale: typeCastApiResponseToBigInt(
			hypercert.orders?.totalUnitsForSale,
		),
		pricePerPercentInUSD: pricePerPercentInUSDNumber,
		buyerCount: uniqueBuyers.size,
	};
};

export const fetchHypercerts = async () => {
	const [hypercertIdFetchError, hypercertIds] = await catchError<
		string[],
		ApiError
	>(fetchHypercertIDs());
	if (hypercertIdFetchError) throw hypercertIdFetchError;

	const hypercertPromises = hypercertIds.map((hypercertId) =>
		fetchHypercertById(hypercertId),
	);
	const [error, hypercerts] = await catchError<Hypercert[], ApiError>(
		Promise.all(hypercertPromises),
	);
	console.log(error);

	if (error) throw error;
	return hypercerts;
};

const fullHypercertByHypercertIdQuery = graphql(`
  query GetFullHypercertsByHypercertId($hypercert_id: String!) {
    hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
      data {
        units
        uri
        creation_block_timestamp
        creator_address
        contract {
          chain_id
        }
        metadata {
          image
          name
          description
          work_scope
          work_timeframe_from
          work_timeframe_to
          contributors
        }
        orders {
          totalUnitsForSale
          cheapestOrder {
            price
            pricePerPercentInToken
            pricePerPercentInUSD
            currency
          }
          data {
            id
            price
            chainId
            pricePerPercentInToken
            pricePerPercentInUSD
            currency
          }
        }
        attestations {
          data {
            attester
            creation_block_timestamp
            data
            id
          }
        }
        sales {
          data {
            amounts
            buyer
            currency
            currency_amount
            creation_block_timestamp
            transaction_hash
          }
        }
      }
    }
  }
`);
type FullHypercertByHypercertIdQueryResponse = ResultOf<
	typeof fullHypercertByHypercertIdQuery
>;

export type FullHypercert = {
	hypercertId: string;

	saleStatus: "coming" | "open" | "sold";
	totalUnits: bigint;
	unitsForSale: bigint;
	uri?: string;
	creationBlockTimestamp: bigint;
	creatorAddress: string;
	chainId?: string;

	metadata: {
		image?: string;
		name?: string;
		description?: string;
		work: {
			scope: string[];
			from?: bigint;
			to?: bigint;
		};
		contributors: string[];
	};

	cheapestOrder: {
		pricePerPercentInUSD?: number;
	};
	orders: {
		id: string;
		price: bigint;
		chainId: string;
		pricePerPercentInToken: number;
		pricePerPercentInUSD: number;
		currency: string;
	}[];
	attestations: {
		attester: string;
		creationBlockTimestamp: bigint;
		data: string;
		id: string;
		easSchema?: {
			id: string;
			schema: string;
		};
	}[];
	sales: {
		unitsBought: bigint;
		buyer: string;
		currency: string;
		currencyAmount: bigint;
		creationBlockTimestamp: bigint;
		transactionHash: string;
	}[];
};

const fetchCachedHypercert = async (hypercertId: string) => {
	try {
		const formattedId = hypercertId.replace(/[^a-zA-Z0-9]/g, "-");
		console.log("formattedId", formattedId);
		const response = await fetch(
			`https://storage.googleapis.com/ecocertain-public/ecocerts/ecocert_${formattedId}.json`,
		);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		console.warn(`Failed to fetch cached hypercert ${hypercertId}:`, error);
		return null;
	}
};

export const fetchFullHypercertById = async (
	hypercertId: string,
	testingLog?: string,
): Promise<FullHypercert> => {
	// Try to fetch from cache first
	const cachedData = await fetchCachedHypercert(hypercertId);
	if (cachedData) {
		// Transform cached data to match FullHypercert type
		return {
			hypercertId,
			saleStatus: cachedData.saleStatus || "open",
			totalUnits: BigInt(cachedData.hypercerts?.data?.[0]?.units || 0),
			unitsForSale: BigInt(
				cachedData.hypercerts?.data?.[0]?.orders?.totalUnitsForSale || 0,
			),
			uri: cachedData.hypercerts?.data?.[0]?.uri,
			creationBlockTimestamp: BigInt(
				cachedData.hypercerts?.data?.[0]?.creation_block_timestamp || 0,
			),
			creatorAddress:
				cachedData.hypercerts?.data?.[0]?.creator_address || "0x0",
			chainId:
				cachedData.hypercerts?.data?.[0]?.contract?.chain_id?.toLowerCase(),
			metadata: {
				image: cachedData.hypercerts?.data?.[0]?.metadata?.image,
				name: cachedData.hypercerts?.data?.[0]?.metadata?.name ?? undefined,
				description:
					cachedData.hypercerts?.data?.[0]?.metadata?.description ?? undefined,
				work: {
					scope: cachedData.hypercerts?.data?.[0]?.metadata?.work_scope || [],
					from: BigInt(
						cachedData.hypercerts?.data?.[0]?.metadata?.work_timeframe_from ||
							0,
					),
					to: BigInt(
						cachedData.hypercerts?.data?.[0]?.metadata?.work_timeframe_to || 0,
					),
				},
				contributors: (
					cachedData.hypercerts?.data?.[0]?.metadata?.contributors || []
				).map((c: string) => c.toLowerCase()),
			},
			cheapestOrder: {
				pricePerPercentInUSD:
					cachedData.hypercerts?.data?.[0]?.orders?.cheapestOrder
						?.pricePerPercentInUSD,
			},
			orders: (cachedData.hypercerts?.data?.[0]?.orders?.data || []).map(
				(order: CachedOrder) => ({
					id: order.id,
					price: BigInt(order.price || 0),
					pricePerPercentInToken: Number(order.pricePerPercentInToken),
					pricePerPercentInUSD: Number(order.pricePerPercentInUSD),
					currency: order.currency.toLowerCase(),
					chainId: order.chainId,
				}),
			),
			sales: (cachedData.hypercerts?.data?.[0]?.sales?.data || []).map(
				(sale: CachedSale) => ({
					unitsBought: BigInt(sale.unitsBought || 0),
					buyer: sale.buyer.toLowerCase(),
					currency: sale.currency.toLowerCase(),
					currencyAmount: BigInt(sale.currencyAmount || 0),
					creationBlockTimestamp: BigInt(sale.creationBlockTimestamp || 0),
					transactionHash: sale.transactionHash,
				}),
			),
			attestations: (
				cachedData.hypercerts?.data?.[0]?.attestations?.data || []
			).map((attestation: CachedAttestation) => ({
				attester: attestation.attester.toLowerCase(),
				creationBlockTimestamp: BigInt(attestation.creationBlockTimestamp || 0),
				data: attestation.data,
				id: attestation.id,
			})),
		};
	}

	// Fallback to GraphQL if cache miss
	if (testingLog) {
		console.log("calling from fetchFullHypercertById", testingLog);
	}
	const [error, response] = await catchError<
		FullHypercertByHypercertIdQueryResponse,
		ApiError
	>(
		fetchGraphQL(
			fullHypercertByHypercertIdQuery,
			{
				hypercert_id: hypercertId,
			},
			testingLog,
		),
	);
	if (error) {
		throw error;
	}

	const hypercert = response.hypercerts.data
		? response.hypercerts.data[0]
		: null;
	if (!hypercert)
		throw {
			message: "Hypercert not found",
			type: "PAYLOAD",
		};

	const cheapestOrder = hypercert.orders?.cheapestOrder;
	const unitsForSale =
		typeCastApiResponseToBigInt(hypercert.orders?.totalUnitsForSale) ?? 0n;

	let saleStatus: "coming" | "open" | "sold" = "open";
	if (!cheapestOrder) {
		if (unitsForSale === 0n) {
			saleStatus = "sold";
		} else {
			saleStatus = "coming";
		}
	}

	const metadata = hypercert.metadata;
	const pricePerPercentInUSD = cheapestOrder?.pricePerPercentInUSD
		? Number(cheapestOrder?.pricePerPercentInUSD)
		: undefined;

	const orders = hypercert.orders?.data ?? [];
	const parsedOrders = orders.map((order) => {
		return {
			id: order.id as string,
			price: typeCastApiResponseToBigInt(order.price) ?? 0n,
			pricePerPercentInToken: Number(order.pricePerPercentInToken),
			pricePerPercentInUSD: Number(order.pricePerPercentInUSD),
			currency: order.currency.toLowerCase() as string,
			chainId: order.chainId as string,
		};
	});

	const sales = hypercert.sales?.data ?? [];
	const parsedSales = sales.map((sale) => {
		return {
			unitsBought: typeCastApiResponseToBigInt(sale.amounts?.[0] ?? 0) ?? 0n,
			buyer: sale.buyer.toLowerCase(),
			currency: sale.currency.toLowerCase(),
			currencyAmount:
				typeCastApiResponseToBigInt(sale.currency_amount ?? 0) ?? 0n,
			creationBlockTimestamp:
				typeCastApiResponseToBigInt(sale.creation_block_timestamp) ?? 0n,
			transactionHash: sale.transaction_hash,
		};
	});

	const attestations = hypercert.attestations?.data ?? [];
	const parsedAttestations = attestations
		.map((attestation) => {
			if (!attestation.attester) return null;
			return {
				attester: attestation.attester.toLowerCase(),
				creationBlockTimestamp:
					typeCastApiResponseToBigInt(attestation.creation_block_timestamp) ??
					0n,
				data: attestation.data as string,
				id: attestation.id,
			};
		})
		.filter((attestation) => attestation !== null);

	const fullHypercert = {
		hypercertId,
		saleStatus,
		totalUnits: typeCastApiResponseToBigInt(hypercert.units) ?? 0n,
		unitsForSale,
		uri: hypercert.uri ?? undefined,
		creationBlockTimestamp:
			typeCastApiResponseToBigInt(hypercert.creation_block_timestamp) ?? 0n,
		creatorAddress: hypercert.creator_address ?? "0x0",
		chainId:
			(hypercert.contract?.chain_id as string).toLowerCase() ?? undefined,
		metadata: {
			image: metadata?.image ?? undefined,
			name: metadata?.name ?? undefined,
			description: metadata?.description ?? undefined,
			work: {
				scope: metadata?.work_scope ?? [],
				from: typeCastApiResponseToBigInt(metadata?.work_timeframe_from) ?? 0n,
				to: typeCastApiResponseToBigInt(metadata?.work_timeframe_to) ?? 0n,
			},
			contributors: (metadata?.contributors ?? []).map((contributor) =>
				contributor.toLowerCase(),
			),
		},
		cheapestOrder: {
			pricePerPercentInUSD,
		},
		orders: parsedOrders,
		sales: parsedSales,
		attestations: parsedAttestations,
	};
	return fullHypercert;
};

export type FullHypercertOrders = Exclude<FullHypercert["orders"], undefined>;
export type FullHypercertWithOrder = Omit<FullHypercert, "orders"> & {
	orders: FullHypercertOrders;
};
