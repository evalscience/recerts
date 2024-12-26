import { graphql, ResultOf } from "gql.tada";
import { hypercert } from "./templates";
import { catchError } from "../utils";
import { Hypercert } from "./hypercerts";
import { ApiError, fetchGraphQL } from "../utils/graphql";
import { typeCastApiResponseToBigInt } from "@/lib/utils";

const hypercertsByUserIdQuery = graphql(`
    query GetHypercertsByUserId($address: String!) {
      hypercerts(
        where: { creator_address: { contains: $address } }
        sort: { by: { attestations_count: descending } }
      ) {
        count
        ${hypercert}
      }
    }
  `);

type HypercertsByUserIdResponse = ResultOf<typeof hypercertsByUserIdQuery>;

export type UserHypercerts = {
  count: number;
  hypercerts: Hypercert[];
};

export const fetchHypercertsByUserId = async (
  address: string
): Promise<UserHypercerts> => {
  const [error, response] = await catchError<
    HypercertsByUserIdResponse,
    ApiError
  >(
    fetchGraphQL(hypercertsByUserIdQuery, {
      address,
    })
  );
  if (error) {
    throw error;
  }

  const hypercerts = response.hypercerts.data;
  if (!hypercerts)
    throw {
      message: "Hypercerts not found",
      type: "PAYLOAD",
    };

  const hypercertsData = hypercerts.map((hypercert) => {
    const pricePerPercentInUSD =
      hypercert.orders?.cheapestOrder?.pricePerPercentInUSD;
    const pricePerPercentInUSDNumber = pricePerPercentInUSD
      ? Number(pricePerPercentInUSD)
      : undefined;

    return {
      hypercertId: hypercert.hypercert_id as string,
      chainId: (hypercert.contract?.chain_id as string) ?? undefined,
      name: hypercert.metadata?.name ?? undefined,
      description: hypercert.metadata?.description ?? undefined,
      image: hypercert.metadata?.image ?? undefined,
      totalUnits: typeCastApiResponseToBigInt(hypercert.units as string),
      unitsForSale: typeCastApiResponseToBigInt(
        hypercert.orders?.totalUnitsForSale as any
      ),
      pricePerPercentInUSD: pricePerPercentInUSDNumber,
    } satisfies Hypercert;
  });

  return {
    hypercerts: hypercertsData,
    count: hypercertsData.length ?? 0,
  };
};
