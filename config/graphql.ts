export const HYPERCERTS_API_URL_REST = "https://staging-api.hypercerts.org/v1";
export const HYPERCERTS_API_URL =
  "https://staging-api.hypercerts.org/v1/graphql";
export const HYPERCERTS_DEFAULT_CONTRACT =
  "0xa16dfb32eb140a6f3f2ac68f41dad8c7e83c4941";

export const UNISWAP_API_URL =
  "https://gateway.thegraph.com/api/f1a8eed8ba2b5908f1d6c6ea9f4832e1/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

const production = "https://staging-api.hypercerts.org/v1/graphql";
const development = "https://staging-api.hypercerts.org/v1/graphql";

export const graphqlEndpoint =
  process.env.NODE_ENV === "production" ? production : development;
