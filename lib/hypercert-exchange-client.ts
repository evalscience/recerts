import "server-only";

import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";

import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";

let hypercertExchangeClient: HypercertExchangeClient | null = null;

/**
 * Retrieves the singleton instance of the getHypercertExchangeClient.
 */
export const getHypercertExchangeClient = (): HypercertExchangeClient => {
	const provider = useEthersProvider();
	const signer = useEthersSigner();

	if (!provider) {
		throw new Error("No provider found");
	}

	if (!signer) {
		throw new Error("No signer found");
	}

	if (hypercertExchangeClient) {
		return hypercertExchangeClient;
	}

  hypercertExchangeClient = new HypercertExchangeClient(
    // @ts-ignore - marketplace SDK expects its ChainId type; we pass viem chain id
    SUPPORTED_CHAINS[0].id,
		// @ts-ignore
		provider as unknown as Provider,
		// @ts-ignore
		signer,
	);

	return hypercertExchangeClient;
};
