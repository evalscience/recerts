import { request } from "graphql-request";
import { isObject } from ".";
import { HYPERCERTS_API_URL } from "@/config/graphql";
import { TadaDocumentNode } from "gql.tada";

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
  query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
  variables?: VariablesType
): Promise<ResponseType> {
  try {
    const response = await request(HYPERCERTS_API_URL, query, variables ?? {});
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
        const httpError = error as any; // Casting to access `response` safely.
        const status = httpError.response?.status;
        const statusText = httpError.response?.statusText;

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
                .map((err: any) => err.message)
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
