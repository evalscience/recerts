import { hyperboardId } from "@/config/hypercert";
import { catchError } from "../utils";
import { fetchGraphQL } from "../utils/graphql";
import { graphql, ResultOf } from "gql.tada";
import { ApiError } from "@/types/api";
import { typeCastApiResponseToBigInt } from "@/lib/utils";
import { hypercert } from "./templates";

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

const fetchHypercertIDs = async () => {
  const [error, response] = await catchError<
    HypercertIdsByHyperboardIdResponse,
    ApiError
  >(
    fetchGraphQL(hypercertIdsByHyperboardIdQuery, {
      hyperboard_id: hyperboardId,
    })
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
  hyperboards.forEach((hyperboard) => {
    hyperboard.sections.data.forEach((section) => {
      section.entries.forEach((entry) => {
        ids.push(entry.id);
      });
    });
  });

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
};

const fetchHypercertById = async (hypercertId: string): Promise<Hypercert> => {
  const [error, response] = await catchError<
    HypercertByHypercertIdQueryResponse,
    ApiError
  >(
    fetchGraphQL(hypercertByHypercertIdQuery, {
      hypercert_id: hypercertId,
    })
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

  return {
    hypercertId,
    chainId: (hypercert.contract?.chain_id as string) ?? undefined,
    name: hypercert.metadata?.name ?? undefined,
    description: hypercert.metadata?.description ?? undefined,
    image: hypercert.metadata?.image ?? undefined,
    totalUnits: typeCastApiResponseToBigInt(hypercert.units as string),
    unitsForSale: typeCastApiResponseToBigInt(
      hypercert.orders?.totalUnitsForSale as any
    ),
    pricePerPercentInUSD: pricePerPercentInUSDNumber,
  };
};

export const fetchHypercerts = async () => {
  const [hypercertIdFetchError, hypercertIds] = await catchError<
    string[],
    ApiError
  >(fetchHypercertIDs());
  if (hypercertIdFetchError) throw hypercertIdFetchError;

  const hypercertPromises = hypercertIds.map((hypercertId) =>
    fetchHypercertById(hypercertId)
  );
  const [error, hypercerts] = await catchError<Hypercert[], ApiError>(
    Promise.all(hypercertPromises)
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
        contract {
          chain_id
        }
        sales {
          data {
            amounts
            buyer
            creation_block_timestamp
            transaction_hash
          }
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
        }
        uri
        creation_block_timestamp
        creator_address
      }
    }
  }
`);
type FullHypercertByHypercertIdQueryResponse = ResultOf<
  typeof fullHypercertByHypercertIdQuery
>;

export type FullHypercert = {
  hypercertId: string;
  creationBlockTimestamp: bigint;
  creatorAddress: string;
  chainId?: string;
  name?: string;
  description?: string;
  work: {
    scope?: string[];
    from?: bigint;
    to?: bigint;
  };
  contributors?: string[];
  image?: string;
  uri?: string;
  totalUnits: bigint;
  sales?: {
    amounts: bigint[];
    buyer: string;
    creationBlockTimestamp: bigint;
    transactionHash: string;
  }[];
  unitsForSale?: bigint;
  pricePerPercentInUSD?: number;
};

export const fetchFullHypercertById = async (
  hypercertId: string
): Promise<FullHypercert> => {
  const [error, response] = await catchError<
    FullHypercertByHypercertIdQueryResponse,
    ApiError
  >(
    fetchGraphQL(fullHypercertByHypercertIdQuery, {
      hypercert_id: hypercertId,
    })
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

  const sales = hypercert.sales?.data?.map((sale) => {
    return {
      amounts: sale.amounts as bigint[],
      buyer: sale.buyer as string,
      creationBlockTimestamp: sale.creation_block_timestamp as bigint,
      transactionHash: sale.transaction_hash as string,
    };
  });

  const pricePerPercentInUSD =
    hypercert.orders?.cheapestOrder?.pricePerPercentInUSD;
  const pricePerPercentInUSDNumber = pricePerPercentInUSD
    ? Number(pricePerPercentInUSD)
    : undefined;

  return {
    hypercertId,
    creationBlockTimestamp: typeCastApiResponseToBigInt(
      hypercert.creation_block_timestamp as string
    ),
    creatorAddress: hypercert.creator_address as string,
    chainId: (hypercert.contract?.chain_id as string) ?? undefined,
    name: hypercert.metadata?.name ?? undefined,
    description: hypercert.metadata?.description ?? undefined,
    work: {
      scope: hypercert.metadata?.work_scope ?? undefined,
      from: typeCastApiResponseToBigInt(
        hypercert.metadata?.work_timeframe_from as any
      ),
      to: typeCastApiResponseToBigInt(
        hypercert.metadata?.work_timeframe_to as any
      ),
    },
    contributors: hypercert.metadata?.contributors ?? undefined,
    image: hypercert.metadata?.image ?? undefined,
    uri: hypercert.uri ?? undefined,
    totalUnits: typeCastApiResponseToBigInt(hypercert.units as string),
    sales,
    unitsForSale: typeCastApiResponseToBigInt(
      hypercert.orders?.totalUnitsForSale as any
    ),
    pricePerPercentInUSD: pricePerPercentInUSDNumber,
  };
};
