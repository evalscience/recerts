"use client";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import { asDeployedChain, deployments } from "@hypercerts-org/contracts";
import {
  WETHAbi,
  addressesByNetwork,
  currenciesByNetwork,
  utils,
} from "@hypercerts-org/marketplace-sdk";
import { useAccount, useReadContract } from "wagmi";

export const useGetCurrentERC20Allowance = () => {
  const { chainId, address } = useAccount();
  const hypercertsExchangeAddress =
    deployments[asDeployedChain(chainId ?? SUPPORTED_CHAINS[0].id)]
      .HypercertExchange;
  const wethAddress =
    currenciesByNetwork[
      utils.asDeployedChain(chainId ?? SUPPORTED_CHAINS[0].id)
    ].WETH.address;
  const { data } = useReadContract({
    abi: WETHAbi,
    address: wethAddress as `0x${string}`,
    chainId,
    functionName: "allowance",
    // enabled: !!chainId && !!address && !!hypercertsExchangeAddress,
    args: [address, hypercertsExchangeAddress],
  });

  return (data || 0n) as bigint;
};
