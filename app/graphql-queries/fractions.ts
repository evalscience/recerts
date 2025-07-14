import { typeCastApiResponseToBigInt } from "@/lib/utils";
import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import {
	type ApiError,
	fetchHypercertsGraphQL as fetchGraphQL,
} from "../utils/graphql";

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

type FractionByIdResponse = ResultOf<typeof fractionsByIdQuery>;

export type FractionById = {
	hypercertId?: string;
	fractionId?: string;
	ownerAddress?: string;
	units?: bigint;
};

export const fetchFractionById = async (
	fractionId: string,
): Promise<FractionById> => {
	const [error, response] = await catchError<FractionByIdResponse, ApiError>(
		fetchGraphQL(fractionsByIdQuery, {
			fractionId,
		}),
	);
	if (error) {
		throw error;
	}

	const fraction = response.fractions.data?.[0];
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
