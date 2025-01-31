// Hypercerts Endpoint Config:
const productionGraphQL = "https://api.hypercerts.org/v1/graphql";
const developmentGraphQL = "https://staging-api.hypercerts.org/v1/graphql";

const productionREST = "https://api.hypercerts.org/v1";
const developmentREST = "https://staging-api.hypercerts.org/v1";

const HYPERCERTS_API_URL_REST =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? productionREST
    : developmentREST;
const HYPERCERTS_API_URL =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? productionGraphQL
    : developmentGraphQL;

export const graphqlEndpoint = HYPERCERTS_API_URL;
export const restEndpoint = HYPERCERTS_API_URL_REST;

// ================================================
// ================================================
// ================================================
// Hypercerts Query Payload Config:

//@TODO: Update the collection ids for prod and dev:
export const collectionId = "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941";
export const hyperboardId =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? process.env.PROD_HYPERBOARD_ID
    : process.env.DEV_HYPERBOARD_ID;
