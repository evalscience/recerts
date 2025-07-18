import type { TadaDocumentNode } from "gql.tada";
import { request } from "graphql-request";
import { tryCatch } from "@/lib/tryCatch";

const defaultHeaders = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  "x-timestamp": Date.now().toString(),
  // Add any other headers you need
  // 'Authorization': 'Bearer your-token',
  // 'Content-Type': 'application/json',
};

export async function fetchGraphQL<ResponseType, VariablesType>(
  apiUrl: string,
  query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
  variables?: VariablesType,
  headers?: Record<string, string>
): Promise<ResponseType> {
  const [data, error] = await tryCatch(() => {
    return request(apiUrl, query, variables ?? {}, headers ?? defaultHeaders);
  });

  if (error) {
    console.error("Fetch failed:", error);
    throw error;
  }

  return data;
}
