"use client";

import { Button } from "@/components/ui/button";
import useAccount from "@/hooks/use-account";
import { useLogin, useLogout } from "@privy-io/react-auth";
import { useEffect } from "react";

const ConnectButton = () => {
	const { isConnected } = useAccount();
	const { login } = useLogin();

	return (
		<Button disabled={isConnected} onClick={() => login()}>
			Login
		</Button>
	);
};
ConnectButton.displayName = "ConnectButton";

export { ConnectButton };
