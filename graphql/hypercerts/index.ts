import { initGraphQLTada, TadaDocumentNode } from "gql.tada";
import type { introspection } from "./env.d.ts";
import { fetchGraphQL } from "../";
import { graphqlEndpoint } from "@/config/hypercerts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export async function fetchHypercertsGraphQL<ResponseType, VariablesType>(
  query: TadaDocumentNode<ResponseType, VariablesType, unknown>,
  variables?: VariablesType,
  headers?: Record<string, string>
): Promise<ResponseType> {
  return fetchGraphQL(graphqlEndpoint, query, variables, headers);
}

export { readFragment } from "gql.tada";
