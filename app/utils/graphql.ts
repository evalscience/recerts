import { HYPERCERTS_API_URL, UNISWAP_API_URL } from "@/config/graphql";
import type { TadaDocumentNode } from "gql.tada";
import { request } from "graphql-request";
import { isObject } from ".";

export type ApiError = {
	message: string;
	type:
		| "PAYLOAD"
		| "SERVER"
		| "CLIENT"
		| "INVALID"
		| "UNKNOWN"
		| "NETWORK"
		| "ABORT";
};

export async function fetchGraphQL<ResponseType, VariablesType>(
	apiUrl: string,
	query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
	variables?: VariablesType,
): Promise<ResponseType> {
	try {
		const response = await request(apiUrl, query, variables ?? {});
		return response;
	} catch (error) {
		console.log(error);
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw { message: "The request was aborted.", type: "ABORT" };
			}

			// Handle network errors
			if ("code" in error) {
				const networkErrorCodes = ["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT"];
				if (networkErrorCodes.includes(error.code as string)) {
					throw { message: error.message, type: "NETWORK" };
				}
			}

			// Handle HTTP errors (4xx, 5xx)
			if ("response" in error) {
				const httpError = error as { response: Record<string, unknown> }; // Casting to access `response` safely.
				const status = httpError.response?.status as number | undefined;
				const statusText = httpError.response?.statusText as string | undefined;

				if (status === undefined) {
					throw {
						message: `Unknown HTTP error: ${error.message}`,
						type: "UNKNOWN",
					};
				}

				if (status >= 400 && status < 500) {
					throw {
						message: `(${status}): ${statusText || "Unknown client error"}`,
						type: "CLIENT",
					};
				}
				if (status >= 500) {
					throw {
						message: `(${status}): ${statusText || "Unknown server error"}`,
						type: "SERVER",
					};
				}

				// Handle GraphQL-specific errors
				if (isObject(error.response)) {
					if ("errors" in error.response) {
						if (Array.isArray(error.response.errors)) {
							const graphQLErrors = error.response.errors;
							const messages = graphQLErrors
								.map((err: Record<string, unknown>) => err.message)
								.join("; ");
							throw {
								message: `GraphQL error(s): ${messages}`,
								type: "PAYLOAD",
							};
						}
					}
				}
			}

			// Handle JSON parsing errors or unexpected responses
			if ("message" in error && error.message.includes("Unexpected token")) {
				throw {
					message: "Response parsing error: Invalid JSON returned from server.",
					type: "INVALID",
				};
			}

			// Fallback for other errors
			throw { message: `Unhandled error: ${error.message}`, type: "UNKNOWN" };
		}

		// If the error is not an instance of Error, return a generic message
		throw { message: "An unknown error occurred.", type: "UNKNOWN" };
	}
}

export async function fetchHypercertsGraphQL<ResponseType, VariablesType>(
	query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
	variables?: VariablesType,
): Promise<ResponseType> {
	return fetchGraphQL(HYPERCERTS_API_URL, query, variables);
}

export async function fetchUniswapGraphQL<ResponseType, VariablesType>(
	query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
	variables?: VariablesType,
): Promise<ResponseType> {
	return fetchGraphQL(UNISWAP_API_URL, query, variables);
}
