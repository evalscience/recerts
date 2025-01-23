import { typeCastApiResponseToBigInt } from "@/lib/utils";
import type { ApiError } from "@/types/api";
import { type ResultOf, graphql } from "gql.tada";
import { catchError } from "../utils";
import { fetchUniswapGraphQL as fetchGraphQL } from "../utils/graphql";
import { hypercert } from "./templates";

const ethPriceUSD = graphql(`
  query ethPriceUSD {
    bundle(id: "1") {
      ethPriceUSD
    }
  }
`);

type EthPriceUSDResponse = ResultOf<typeof ethPriceUSD>;

export const fetchEthPriceUSD = async () => {
	const [error, response] = await catchError<EthPriceUSDResponse, ApiError>(
		fetchGraphQL(ethPriceUSD, {}),
	);
	if (error) {
		throw error;
	}

	//@ts-ignore
	return typeCastApiResponseToBigInt(response.bundle.ethPriceUSD as string);
};
