import { typeCastApiResponseToBigInt } from "@/lib/utils";
import { fetchHypercertsGraphQL as fetchGraphQL, graphql } from "../";
import { tryCatch } from "@/lib/tryCatch";

const fractionsByIdQuery = graphql(`
  query GetFractionById($fractionId: String!) {
    fractions(where: { fraction_id: { eq: $fractionId } }) {
      data {
        hypercert_id
        fraction_id
        units
        owner_address
      }
    }
  }
`);

export type FractionById = {
  hypercertId?: string;
  fractionId?: string;
  ownerAddress?: string;
  units?: bigint;
};

export const fetchFractionById = async (
  fractionId: string
): Promise<FractionById> => {
  const [response, error] = await tryCatch(() =>
    fetchGraphQL(fractionsByIdQuery, {
      fractionId,
    })
  );
  if (error) throw error;

  const fraction = response.fractions?.data?.[0];
  if (!fraction)
    throw {
      message: "Fractions not found",
      type: "PAYLOAD",
    };

  const fractionData = {
    hypercertId: fraction.hypercert_id ?? undefined,
    fractionId: fraction.fraction_id ?? undefined,
    units: typeCastApiResponseToBigInt(fraction.units as string),
    ownerAddress: fraction.owner_address ?? undefined,
  } satisfies FractionById;

  return fractionData;
};
