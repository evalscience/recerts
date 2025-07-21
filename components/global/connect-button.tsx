"use client";

import { Button } from "@/components/ui/button";
import useAccount from "@/hooks/use-account";
import { useLogin } from "@privy-io/react-auth";

const ConnectButton = () => {
	const { isConnected } = useAccount();
	const { login } = useLogin();

	return (
		<Button disabled={isConnected} onClick={() => login()}>
			Connect Wallet
		</Button>
	);
};
ConnectButton.displayName = "ConnectButton";

export { ConnectButton };
