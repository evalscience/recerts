import { useActiveWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import React from "react";
import { useAccount as useWagmiAccount } from "wagmi";

type Account = {
	address: `0x${string}` | undefined;
	chainId: number | undefined;
	isConnected: boolean;
	isConnecting: boolean;
	authenticated: boolean;
};

const useAccount = (): Account => {
	const { authenticated, ready } = usePrivy();
	const { wallet: activeWallet } = useActiveWallet();
	const {
		address: wagmiAddress,
		chainId,
		isConnected,
		isConnecting,
	} = useWagmiAccount();

	if (!ready)
		return {
			address: undefined,
			chainId: undefined,
			isConnected: false,
			isConnecting: true,
			authenticated: false,
		};

	// Prioritize active wallet address from Privy when available
	const address = activeWallet?.address || wagmiAddress;

	return {
		address: address as `0x${string}`,
		chainId: authenticated ? chainId : undefined,
		isConnected: authenticated && isConnected,
		isConnecting,
		authenticated,
	};
};

export default useAccount;
