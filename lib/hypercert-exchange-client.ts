import "server-only";

import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";

import { useEthersProvider } from "@/hooks/use-ethers-provider";
import { useEthersSigner } from "@/hooks/use-ethers-signer";
import { SUPPORTED_CHAIN } from "@/config/wagmi";

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
    SUPPORTED_CHAIN.id,
    // @ts-ignore
    provider as unknown as Provider,
    // @ts-ignore
    signer
  );

  return hypercertExchangeClient;
};
