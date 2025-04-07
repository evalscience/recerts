import { typeCastApiResponseToBigInt } from "@/lib/utils";
import type { ApiError } from "@/types/api";
import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import { fetchHypercertsGraphQL } from "../utils/graphql";

const attestationsByTokenIdQuery = graphql(
	`
    query GetEcocertAttestations($token_id: String!) {
      attestations(
        where: {
          token_id: { eq: $token_id }
          chain_id: { eq: 42220 }
          eas_schema: {
            uid: {
              eq: "0x48e3e1be1e08084b408a7035ac889f2a840b440bbf10758d14fb722831a200c3"
            }
          }
        }
      ) {
        data {
          id
          uid
          schema_uid
          data
          attester
          creation_block_timestamp
        }
      }
    }
  `,
);

type AttestationByTokenIdQueryResponse = ResultOf<
	typeof attestationsByTokenIdQuery
>;

type AttestationDataResponse = {
	title: string;
	chain_id: string;
	token_id: string;
	description: string;
	contract_address: string;
	sources: string[];
};

type AttestationData = Omit<AttestationDataResponse, "sources"> & {
	sources: {
		type: string;
		src: string;
	}[];
};

export type EcocertAttestation = {
	id: string;
	uid: string;
	schema_uid: string;
	data: AttestationData;
	attester: string;
	creationBlockTimestamp: bigint;
};

const fetchAttestationByHypercertId = async (
	hypercertId: string,
): Promise<EcocertAttestation[]> => {
	const [error, response] = await catchError<
		AttestationByTokenIdQueryResponse,
		ApiError
	>(
		fetchHypercertsGraphQL(attestationsByTokenIdQuery, {
			token_id: hypercertId.split("-")[2],
		}),
	);
	if (error) {
		throw error;
	}

	const attestations =
		response.attestations.data?.map((attestation) => {
			const data = attestation.data as AttestationDataResponse;
			const parsedData: AttestationData = {
				...data,
				sources: data.sources.map((source) => JSON.parse(source)) as {
					type: string;
					src: string;
				}[],
			};
			return {
				id: attestation.id,
				uid: attestation.uid ?? "",
				schema_uid: (attestation.schema_uid ?? "") as string,
				data: parsedData,
				attester: attestation.attester ?? "",
				creationBlockTimestamp:
					typeCastApiResponseToBigInt(attestation.creation_block_timestamp) ??
					0n,
			};
		}) ?? [];

	return attestations;
};

export default fetchAttestationByHypercertId;
